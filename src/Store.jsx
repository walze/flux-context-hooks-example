import React, { createContext, useReducer, useContext } from 'react';
import { ACTION_TYPES } from './Actions';


const init_state = {
    count: 0,
};

/**
 * @param { typeof init_state } oldState 
 * @param { IAction } param1 
 */
const reducer = (oldState = init_state, { type, payload }) => {
    const state = { ...oldState }

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

/** @type { [ typeof init_state, (action: IAction) => void ] } */
export const StoreContext = createContext([init_state, reducer]);

export const useStore = () => {
    /** @type { typeof StoreContext[0] } */
    const state = useContext(StoreContext)[0]

    return state
};

export const Store = ({ children }) => {

    const [state, dispatcher] = useReducer(reducer, init_state)

    return (
        <StoreContext.Provider value={[state, dispatcher]}>
            {children}
        </StoreContext.Provider>
    )
}



/**
 * @typedef IAction
 * @property { import('./Actions').TYPES } type
 * @property { import('./Actions').PAYLOAD_TYPE<import('./Actions').TYPES> } payload
 */
