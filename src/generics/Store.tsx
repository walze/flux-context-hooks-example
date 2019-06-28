import React, { useState, useEffect, FunctionComponent, memo, ReactElement, NamedExoticComponent, PropsWithRef, PropsWithChildren } from 'react'

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


  get state() {
    return { ...this._state }
  }


  public onChange = (cb: (state: State) => void) => EE.on('store_change', cb)

  public useFlux: () => [State, Store<State>["onChange"]] = () => [this._state, this.onChange]

  /**
   * Connects component to store, when store changes, component's props get updated
   * @param component - component to be connected
   * @param listenedKeys - keys of store that are gonna be listened to
   */
  public connect<Props>(
    component: ConnectedStore<Props, State>,
    listenedKeys: Array<keyof State>,
  ) {
    const MemoizedComponent = memo(component)

    // builds partial state from store and memoizes it
    const initialState = this._buildPartialFromKeys(this._state, listenedKeys)
    const memoizedStoreState = memoize(() => initialState, Object.values(initialState))

    // creates new component to add props and listen to changes
    const ConnectedComponent: FunctionComponent<Props & { store?: State }> = (props: Props) => {
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

      return <MemoizedComponent {...props} store={state as State} />
    }

    return ConnectedComponent
  }

  public connect2<T, P, S2 = {}, SS = any>(
    component: FunctionComponent<P>,
    listenerFn: storeListenerFn<State, T>,
  ) {
    const MemoizedComponent = () => memo(component) as unknown as React.Component<P, S2, SS>

    // builds partial state from store and memoizes it
    const initialState = listenerFn(this.state)
    const memoizedStoreState = memoize(() => initialState, Object.values(initialState))

    // creates new component to add props and listen to changes
    const ConnectedComponent: ConnectedPartialStore<P, { store?: TkeyofT<T> }> = (props: P) => {
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

      return <MemoizedComponent {...props} />
    }


    if (!ConnectedComponent.defaultProps)
      ConnectedComponent.defaultProps = {}

    ConnectedComponent.defaultProps = {
      ...ConnectedComponent.defaultProps,
      store: listenerFn
    }


    return ConnectedComponent
  }

  public createListener<T>(fn: storeListenerFn<State, T>) {
    return (s: State) => fn(s)
  }

  private _buildPartialFromKeys<T>(obj: T, keys: (keyof T)[]) {
    return keys.reduce((partial, key) => ({ ...partial, [key]: obj[key] }), {} as Partial<T>)
  }

  abstract _reduce<T>(actions: Partial<ActionsCreator<T>["ACTIONS_DECLARATIONS"]>): State
}

export type storeListenerFn<S, T> = (state: S) => TkeyofT<T>;
export type ConnectedStoreProps<P, S> = TkeyofT<P> & { store: S }
type ConnectedPartialStoreProps<P, S> = TkeyofT<P> & { store?: S }

export type ConnectedStore<P, S> = FunctionComponent<ConnectedStoreProps<P, S>>
type ConnectedPartialStore<P, S> = FunctionComponent<ConnectedPartialStoreProps<P, S>>
