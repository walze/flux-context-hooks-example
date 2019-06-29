import React, { useState, useEffect, memo, ComponentType } from 'react'

import { EE } from './EventEmitter'
import { memoize, TkeyofT } from '../helpers'
import { ActionsCreator } from './ActionsCreator'

export abstract class Store<State extends Object> {
  private _state: State


  constructor(initialState: State) {
    this._state = initialState

    EE.on('dispatch', ({ type, payload }) => {
      if (type !== 'BATCH_DISPATCH')
        this._state = this._reduce({ [type]: payload })
      else
        this._state = this._reduce(payload)

      EE.emit('store_change', this._state)
    })
  }


  /**
   * Returns a copy of store's state
   */
  get state() {
    return { ...this._state }
  }

  /**
   * Calls the callback argument everytime the store changes
   * @returns unsubscribe function
   */
  public onChange = (cb: (state: State) => void) => EE.on('store_change', cb)


  /**
   * Hooks that returns state and onChange
   */
  public useFlux: () => [State, Store<State>["onChange"]] = () => [this._state, this.onChange]


  /**
   * Connects component to store, when store changes, component's props get updated
   * @param component - component to be connected
   * @param listenedKeys - keys of store that are gonna be listened to
   */
  public connect<P, T>(
    component: ComponentType<P>,
    listenerFn: storeListenerFn<State, T>,
  ) {
    // Memoizes component
    const MemoizedComponent = memo(component) as unknown as ComponentType<Omit<P, "store">>

    // builds partial state from store and memoizes it
    const initialState = listenerFn(this.state)
    const memoizedStoreState = memoize(() => initialState, Object.values(initialState))

    // creates new component to add props and listen to changes
    const ConnectedComponent: ComponentType<Omit<P, "store">> = props => {
      const [state, setState] = useState(initialState)

      const onStoreChange = () => this.onChange(newStoreState => {
        // intersects new store state with keys listened
        const newValues = listenerFn(newStoreState)

        // returns old state if no property has changed
        const newState = memoizedStoreState(Object.values(newValues), () => newValues)

        // updates state depending if changed
        if (newState !== state)
          setState(newState)
      })

      useEffect(onStoreChange, [])

      return (
        <MemoizedComponent
          store={state}
          {...props}
        />
      )
    }


    return ConnectedComponent
  }

  public createListener<T>(fn: storeListenerFn<State, T>) {
    return (s: State) => fn(s)
  }

  abstract _reduce<T>(actions: Partial<ActionsCreator<T>["ACTIONS_DECLARATIONS"]>): State
}

export type storeListenerFn<S, T> = (state: S) => TkeyofT<T>;
export type ConnectedStoreProps<Props, Listener> = TkeyofT<Props> & { store: Listener }
export type ConnectedStore<P, S> = ComponentType<ConnectedStoreProps<P, S>>
