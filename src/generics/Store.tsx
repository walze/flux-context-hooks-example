import { useState, useEffect, FunctionComponent } from 'react'

import { EE } from '../EventEmitter';
import { TYPES, PAYLOAD_TYPE } from '../Actions'
import { ListenerFn } from 'eventemitter3';

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


  public onChange = (cb: ListenerFn) => EE.on('store_change', cb)

  public useFlux: () => [S, Store<S>["onChange"]] = () => [this.state, this.onChange]


  public connect<P>(component: ConnectedFunctionComponent<P, { store: S }>) {
    const [store, onChange] = this.useFlux()

    const newComponent: ConnectedFunctionComponent<P, { store?: S }> = (props: P) => {
      const [state, setState] = useState(store);

      useEffect(() => onChange(setState), [])

      const rendered = component({ ...props, store: state })

      return rendered
    }

    if (!newComponent.defaultProps)
      newComponent.defaultProps = {}

    newComponent.defaultProps = { ...newComponent.defaultProps, store }

    return newComponent
  }


  abstract _reduce(_: Action): S
}

// export interface ConnectedFunctionComponent<P, S> extends FunctionComponent<ConnectedStore<P, S>> {
//   (props: ConnectedStore<P, S>): ReactElement
//   defaultProps: Partial<ConnectedStore<P, S>> & { store: S }
// }

type ConnectedFunctionComponent<P, S> = FunctionComponent<P & S>
export type ConnectedStore<P, S> = FunctionComponent<P & { store: S }>
export type Action = { [K in TYPES]?: PAYLOAD_TYPE[K] }
