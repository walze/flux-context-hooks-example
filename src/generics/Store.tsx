import React, { useState, useEffect, FunctionComponent, memo } from 'react'

import { EE } from './EventEmitter'
import { memoize, TkeyofT } from '../helpers'
import { ActionsCreator } from './ActionsCreator'

export abstract class Store<ListenerObject extends Object> {
  private _state: ListenerObject


  constructor(initialState: ListenerObject) {
    this._state = initialState

    EE.on('dispatch', ({ type, payload }) => {
      if (type !== 'BATCH_DISPATCH')
        this._state = this._reduce({ [type]: payload })
      else
        this._state = this._reduce(payload)

      EE.emit('store_change', this._state)
    })
  }


  get state() {
    return { ...this._state }
  }


  public onChange = (cb: (store: ListenerObject) => void) => EE.on('store_change', cb)

  public useFlux: () => [ListenerObject, Store<ListenerObject>["onChange"]] = () => [this._state, this.onChange]

  /**
   * Connects component to store, when store changes, component's props get updated
   * @param component - component to be connected
   * @param listenedKeys - keys of store that are gonna be listened to
   */
  public connect<Props>(
    component: ConnectedStore<Props, ListenerObject>,
    listenedKeys: Array<keyof ListenerObject>,
  ) {
    const MemoizedComponent = memo(component)

    // builds partial state from store and memoizes it
    const initialState = this._buildPartialFromKeys(this._state, listenedKeys)
    const memoizedStoreState = memoize(() => initialState, Object.values(initialState))

    // creates new component to add props and listen to changes
    const ConnectedComponent: FunctionComponent<Props & { store?: ListenerObject }> = (props: Props) => {
      const [state, setState] = useState(initialState)

      const onStoreChange = () => this.onChange(newStoreState => {
        // intersects new store state with keys listened
        const intersection = this._buildPartialFromKeys(newStoreState, listenedKeys)

        // returns old state if no property has changed
        const newState = memoizedStoreState(Object.values(intersection), () => intersection)

        // updates state depending if changed
        if (newState !== state)
          setState(newState)
      })

      useEffect(onStoreChange, [])

      return <MemoizedComponent {...props} store={state as ListenerObject} />
    }


    if (!ConnectedComponent.defaultProps)
      ConnectedComponent.defaultProps = {}

    ConnectedComponent.defaultProps = {
      ...ConnectedComponent.defaultProps,
      store: listenedKeys
    }

    return ConnectedComponent
  }

  public connect2<P, T>(
    component: ConnectedStore<P, Partial<TkeyofT<T>>>,
    listenerFn: storeListenerFn<ListenerObject, T>,
  ) {
    const MemoizedComponent = memo(component)

    // builds partial state from store and memoizes it
    const initialState = listenerFn(this.state)
    const memoizedStoreState = memoize(() => initialState, Object.values(initialState))

    // creates new component to add props and listen to changes
    const ConnectedComponent: FunctionComponent<P & { store?: TkeyofT<T> }> = (props: P) => {
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

      return <MemoizedComponent {...props} store={state} />
    }


    if (!ConnectedComponent.defaultProps)
      ConnectedComponent.defaultProps = {}

    ConnectedComponent.defaultProps = {
      ...ConnectedComponent.defaultProps,
      store: listenerFn
    }

    return ConnectedComponent
  }

  public createListener<T>(fn: storeListenerFn<ListenerObject, T>) {
    return (s: ListenerObject) => fn(s)
  }

  private _buildPartialFromKeys<T>(obj: T, keys: (keyof T)[]) {
    return keys.reduce((partial, key) => ({ ...partial, [key]: obj[key] }), {} as Partial<T>)
  }

  abstract _reduce<T>(actions: Partial<ActionsCreator<T>["ACTIONS_DECLARATIONS"]>): ListenerObject
}

export type storeListenerFn<S, T> = (state: S) => TkeyofT<T>;
export type ConnectedStoreProps<P, S> = P & { store: S }
export type ConnectedStore<P, S> = FunctionComponent<ConnectedStoreProps<P, S>>
