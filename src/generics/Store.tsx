import React, { useState, useEffect, memo, ComponentType } from 'react'

import { EE, IDispatch } from './EventEmitter'
import { memoize, TkeyofT } from '../helpers'
import { ActionsCreator } from './ActionsCreator'

// const count = useStoreState(generalStore, () => generalStore.state.count)
// const count = useStoreState(generalStore, state => state.count)

export const useStoreState = <S extends object, T>(
  store: Store<S>,
  cb: (state: S) => T,
) => {
  const { state, onChange } = store
  const [storeState, setState] = useState(cb(state))

  useEffect(
    () => onChange((newState) => {
      const newCallback = cb(newState)

      if (!Object.is(storeState, newCallback))
        setState(newCallback)
    }),
    [],
  )

  return storeState
}

export abstract class Store<State extends object> {
  /**
   * Returns a copy of store's state
   */
  public get state() {
    return { ...this._state }
  }


  private _state: State


  public constructor(initialState: State) {
    this._state = initialState

    EE.on('dispatch', async ({ type, payload }: IDispatch<unknown>) => {
      const newState = type !== 'BATCH_DISPATCH'
        ? this._reduce({ [type]: payload })
        : this._reduce(payload)

      this._state = await newState
      EE.emit('store_change', await newState)
    })
  }




  /**
   * Connects component to store, when store changes, component's props get updated
   * @param component - component to be connected
   * @param listenedKeys - keys of store that are gonna be listened to
   */
  public connect<P, T>(
    component: ComponentType<ConnectedStoreProps<P, T>>,
    listenerFn: storeListenerFn<State, T>,
  ) {
    // Memoizes component
    const MemoizedComponent = memo(component) as unknown as ComponentType<Omit<P, "store">>

    // builds partial state from store and memoizes it
    const initialState = listenerFn(this.state)
    const memoizedStoreState = memoize(() => initialState, Object.values(initialState))

    // creates new component to add props and listen to changes
    const ConnectedComponent: ComponentType<Omit<P, "store">> = (props) => {
      const [state, setState] = useState(initialState)

      const onStoreChange = () => this.onChange((newStoreState) => {
        // intersects new store state with keys listened
        const newValues = listenerFn(newStoreState)

        // returns old state if no property has changed
        const newState = memoizedStoreState(Object.values(newValues), () => newValues)

        // updates state depending if changed
        if (!Object.is(newState, state))
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


  /**
   * Helper to create listener in non-typescript code
   * @param fn - funcions that returns listener
   */
  public createListener = <T, _>(fn: storeListenerFn<State, T>) => fn


  /**
   * Calls the callback argument everytime the store changes
   * @returns unsubscribe function
   */
  public onChange = (cb: (state: State) => void) => EE.on('store_change', cb)


  /**
   * Hooks that returns state and onChange
   */
  public useFlux: () => [State, Store<State>["onChange"]] = () => [this._state, this.onChange]


  protected abstract _reduce<T>(ACTIONS: Partial<ActionsCreator<T>["ACTIONS_DECLARATIONS"]>): Promise<State>
}

export type storeListenerFn<S, T> = (state: S) => TkeyofT<T>;
export type ConnectedStoreProps<Props, Listener> = TkeyofT<Props> & { store: Listener }
export type ConnectedStore<P, S> = ComponentType<ConnectedStoreProps<P, S>>
