import { useState, useEffect } from 'react'

import { EE } from './EventEmitter';
import { ACTION_TYPES } from './Actions';


const INIT_STATE = {
  count: 0,
  word: 'global',
};

let mutableState = INIT_STATE


/**
 * @param { IAction } action
 */
const reducer = (action) => {
  const {
    ADD_COUNTER,
    REPEAT_WORD
  } = action

  const state = { ...mutableState }

  if (ADD_COUNTER) {
    state.count += ADD_COUNTER

    return state
  }

  if (REPEAT_WORD) {
    state.word += REPEAT_WORD

    return state
  }

  console.error('Unknown Type', action)
}


/**
 * @param { import('eventemitter3').ListenerFn } cb 
 */
const onStoreChange = cb => EE.on('store_change', cb)


const getStore = () => ({ ...mutableState })


/**
 * @returns { [typeof getStore, typeof onStoreChange] }
 */
export const useFlux = () => [getStore, onStoreChange]


/**
 * @template P
 * @param { (props: ConnectedStore<P>) => JSX.Element } c 
 */
export const connectStore = c => {
  const [getStore, onChange] = useFlux()

  /**
   * @param { P } props
   */
  const newComponent = (props) => {
    const [state, setState] = useState(getStore());

    useEffect(() => onChange(setState), [])

    return c({ ...props, store: state })
  }

  return newComponent
}


EE.on('dispatch', ({ type, payload }) => {
  mutableState = reducer({ [type]: payload })

  EE.emit('store_change', mutableState)
})



/**
 * @typedef { Partial<{ [K in import('./Actions').TYPES]: import('./Actions').PAYLOAD_TYPE[K] }> } IAction
 */

/**
 * @template P
 * @typedef { P & { store: typeof INIT_STATE}} ConnectedStore
 */