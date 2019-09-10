import React, { useState, useEffect, memo, ComponentType } from 'react'

import { IDispatch, EVENTS, EventEmitter } from './EventEmitter'
import { memoize, TkeyofT } from '../helpers'
import { ActionsCreator } from './ActionsCreator'

// const count = useStoreState(generalStore, () => generalStore.state.count)
// const count = useStoreState(generalStore, state => state.count)

export interface IStore<State> {
  _state: State
  emitter: EventEmitter
  onChange(cb: (state: State) => void): () => void
  useStore(): State
}


export const useStoreState = <S, T>(
  store: IStore<S>,
  cb: (state: S) => T,
) => {
  const { _state, onChange } = store
  const [storeState, setState] = useState(cb(_state))

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


export const createStore = <State extends object>(
  _state: State,
  _reduce: <T>(actions: Partial<ActionsCreator<T>["ACTIONS_DECLARATIONS"]>, state: State) => Promise<State>,
): IStore<State> => {
  const emitter = new EventEmitter()
  /** Returns remover */
  const onChange = (cb: (state: State) => void) => emitter.on(EVENTS.STORE_CHANGE, cb)

  const useStore = () => {
    const [state, setState] = useState(_state)

    useEffect(
      () => {
        const onDispatch = async ({ type, payload }: IDispatch<unknown>) => {
          const newStatePromise = Object.is(type, EVENTS.BATCH_DISPATCH)
            ? _reduce({ [type]: payload }, state)
            : _reduce(payload, state)

          const newState = { ...(await newStatePromise) }

          setState(newState)
          emitter.emit(EVENTS.STORE_CHANGE, newState)
        }

        emitter.on(EVENTS.DISPATCH, onDispatch)

        return () => { emitter.off(EVENTS.DISPATCH, onDispatch) }
      },
      [],
    )

    return state
  }

  return { useStore, emitter, onChange, _state }
}

/**
 * Connects component to store, when store changes, component's props get updated
 * @param component - component to be connected
 * @param listenedKeys - keys of store that are gonna be listened to
 */
export const connectStore = <P, T, State>(
  store: IStore<State>,
  component: ComponentType<ConnectedStoreProps<P, T>>,
  listenerFn: storeListenerFn<State, T>,
) => {
  // Memoizes component
  const MemoizedComponent = memo(component) as unknown as ComponentType<Omit<P, "store">>

  // builds partial state from store and memoizes it
  const initialState = listenerFn(store._state)
  const memoizedStoreState = memoize(() => initialState, Object.values(initialState))

  // creates new component to add props and listen to changes
  const ConnectedComponent: ComponentType<Omit<P, "store">> = (props) => {
    const [state, setState] = useState(initialState)

    const onStoreChange = () => store.onChange((newStoreState) => {
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





export type storeListenerFn<S, T> = (state: S) => TkeyofT<T>;
export type ConnectedStoreProps<Props, Listener> = TkeyofT<Props> & { store: Listener }
export type ConnectedStore<P, S> = ComponentType<ConnectedStoreProps<P, S>>
