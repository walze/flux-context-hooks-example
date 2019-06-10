import { useState, useEffect } from 'react'

import { EE } from './EventEmitter';
import { ACTION_TYPES } from './Actions';


const init_state = {
    count: 0,
};

let mutableState = init_state

/**
 * @param { IAction } action 
 */
const reducer = (action) => {
    const {
        ADD_COUNTER,
        REMOVE_COUNTER,
        TEST
    } = action

    const state = { ...mutableState }

    if (ADD_COUNTER) {
        state.count += ADD_COUNTER
    }

    return state
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
    if (!(type in ACTION_TYPES)) throw new Error(`Unknown type ${type}`)

    mutableState = reducer({ [type]: payload })

    EE.emit('store_change', mutableState)
})

/**
 * @typedef { Partial<{ [K in import('./Actions').TYPES]: import('./Actions').PAYLOAD_TYPE[K] }> } IAction
 */

/**
 * @template P
 * @typedef { P & { store: typeof init_state}} ConnectedStore
 */