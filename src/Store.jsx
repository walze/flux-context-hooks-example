import { EE } from './EventEmitter';
import { ACTION_TYPES } from './Actions';


const init_state = {
    count: 0,
};

let mutableState = init_state

/**
 * @param { typeof init_state } oldState 
 * @param { IAction } param1 
 */
const reducer = ({ type, payload }) => {
    const state = { ...mutableState }

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


export const useFlux = () => {
    const onChange = cb => {
        EE.on('store_change', cb)

        return () => EE.off('store_change', cb)
    }

    return [{ ...mutableState }, onChange]
}


EE.on('dispatch', payload => {
    mutableState = reducer(payload)

    EE.emit('store_change', mutableState)
})

/**
 * @typedef IAction
 * @property { import('./Actions').TYPES } type
 * @property { import('./Actions').PAYLOAD_TYPE<import('./Actions').TYPES> } payload
 */