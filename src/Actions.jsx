import { dispatch } from "./dispatcher";

const ACTION_TYPES_DECLARATIONS = {
    ADD_COUNTER: 0,
    REMOVE_COUNTER: 0,
    TEST: '',
}

const ACTION_TYPES_ARRAY = Object.keys(ACTION_TYPES_DECLARATIONS)


/**
 * @return { IDecoratedActions }
 */
const reduceTypes = () => {
    const fn = type => payload => {
        const action = { type, payload }

        dispatch(action)
    }

    return ACTION_TYPES_ARRAY
        .reduce(
            (acc, type) => ({ ...acc, [type]: fn(type) }),
            {}
        )
}

/** @type { IDecoratedActions } */
let reducedTypes

export const useActions = () => reducedTypes || (reducedTypes = reduceTypes())


export const ACTION_TYPES = ACTION_TYPES_ARRAY
    .reduce((acc, type) => ({ ...acc, [type]: type }), {})



/**
 * @typedef { { [K in TYPES]: (payload: PAYLOAD_TYPE<K>) => void } } IDecoratedActions
 */

/**
 * @template T
 * @typedef { typeof ACTION_TYPES_DECLARATIONS[T] } PAYLOAD_TYPE
 */

/**
 * @typedef { keyof typeof ACTION_TYPES_DECLARATIONS } TYPES
 */