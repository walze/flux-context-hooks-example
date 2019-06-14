import React, { useState, useEffect, FunctionComponent, memo, useMemo } from 'react'

import { EE } from '../EventEmitter';
import { TYPES, PAYLOAD_TYPE } from '../Actions'
import { memoize } from '../helpers';

export abstract class Store<S extends Object> {
  private _state: S


  constructor(initialState: S) {
    this._state = initialState

    EE.on('dispatch', ({ type, payload }) => {
      this._state = this._reduce({ [type]: payload })

      EE.emit('store_change', this._state)
    })
  }


  get state() {
    return { ...this._state }
  }


  public onChange = (cb: (store: S) => void) => EE.on('store_change', cb)

  public useFlux: () => [S, Store<S>["onChange"]] = () => [this.state, this.onChange]


  public connect<P>(
    component: FunctionComponent<P & { store: S }>,
    listenedKeys: Array<keyof S>,
  ) {
    const MemoizedComponent = memo(component)

    const initObj = this._buildPartialFromKeys(this._state, listenedKeys)
    const memoizedState = memoize(
      () => initObj,
      Object.values(initObj)
    )

    const newComponent: FunctionComponent<P & { store?: S }> = (props: P) => {
      const [state, setState] = useState(initObj);

      const onStoreChange = () => this.onChange((newStoreState => {
        const intersect = this._buildPartialFromKeys(newStoreState, listenedKeys)

        const newState = memoizedState(
          Object.values(intersect),
          () => intersect,
        )

        setState(newState)
      }))

      useEffect(onStoreChange, [])

      return <MemoizedComponent {...props} store={state as S} />
    }


    if (!newComponent.defaultProps)
      newComponent.defaultProps = {}

    newComponent.defaultProps = {
      ...newComponent.defaultProps,
      store: listenedKeys
    }

    return newComponent
  }


  private _buildPartialFromKeys<T>(obj: T, keys: (keyof T)[]) {
    return keys.reduce((partial, key) => ({ ...partial, [key]: obj[key] }), {} as Partial<T>);
  }

  abstract _reduce(_: Action): S
}

export type ConnectedStore<P, S> = FunctionComponent<P & { store: S }>
export type Action = { [K in TYPES]?: PAYLOAD_TYPE[K] }
