import { dispatch } from "./dispatcher";

const ACTION_TYPES_DECLARATIONS = {
    ADD_COUNTER: 0,
    REMOVE_COUNTER: 0,
    TEST: '',
}

/**
 * @type { Array<keyof typeof ACTION_TYPES_DECLARATIONS> }
 */
const ACTION_TYPES_ARRAY = Object.keys(ACTION_TYPES_DECLARATIONS)


/**
 * @return { IDecoratedActions }
 */
const reduceTypes = () => ACTION_TYPES_ARRAY
    .reduce(
        (acc, type) => {
            const dispatchFn = payload => dispatch({ type, payload })

            return { ...acc, [type]: dispatchFn }
        },
        {}
    )

/** @type { IDecoratedActions } */
let reducedTypes

export const useActions = () => reducedTypes || (reducedTypes = reduceTypes())


export const ACTION_TYPES = ACTION_TYPES_ARRAY
    .reduce((acc, type) => ({ ...acc, [type]: type }), {})



/**
 * @typedef { { [K in TYPES]: (payload: PAYLOAD_TYPE[K]) => void } } IDecoratedActions
 */

/**
 * @typedef { typeof ACTION_TYPES_DECLARATIONS } PAYLOAD_TYPE
 */

/**
 * @typedef { keyof typeof ACTION_TYPES_DECLARATIONS } TYPES
 */