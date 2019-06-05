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
    const state = { ...mutableState }

    const type = action.type
    const payload = action.payload

    console.warn({ type, payload })

    switch (type) {
        case ACTION_TYPES.ADD_COUNTER:
            state.count += payload
            break;

        default:
            throw new Error(`unknown type ${type}`)
    }

    return state
}

/**
 * @param { import('eventemitter3').ListenerFn } cb 
 */
const onStoreChange = cb => {
    EE.on('store_change', cb)

    return () => EE.off('store_change', cb)
}

const getStore = () => ({ ...mutableState })

/**
 * @returns { [typeof getStore, typeof onStoreChange] }
 */
export const useFlux = () => [getStore, onStoreChange]

/**
 * @template T
 * @param { (props: {store: typeof init_state} & T) => JSX.Element } c 
 */
export const connectStore = c => {
    const [getStore, onChange] = useFlux()

    /**
     * @param { T } props
     */
    const newComponent = (props) => {
        const [state, setState] = useState(getStore());

        useEffect(() => onChange(setState), [])

        return c({ ...props, store: state })
    }

    return newComponent
}


EE.on('dispatch', payload => {
    mutableState = reducer(payload)

    EE.emit('store_change', mutableState)
})

/**
 * @typedef IAction
 * @property { import('./Actions').TYPES } type
 * @property { import('./Actions').PAYLOAD_TYPE[IAction["type"]] } payload
 */