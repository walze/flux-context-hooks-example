import { dispatch } from "./dispatcher";

const ACTION_TYPES_DECLARATIONS = {
    ADD_COUNTER: 0,
    REMOVE_COUNTER: 0,
    TEST: '',
}

const ACTION_TYPES_ARRAY = objectKeys(ACTION_TYPES_DECLARATIONS)


/**
 * @type { IDecoratedActions }
 */
let typesStartValue

const reduceTypes = () => ACTION_TYPES_ARRAY
    .reduce(
        (acc, type) => {
            const dispatchFn = payload => dispatch({ type, payload })

            return { ...acc, [type]: dispatchFn }
        },
        typesStartValue
    )

/** @type { IDecoratedActions } */
let reducedTypes

export const useActions = () => reducedTypes || (reducedTypes = reduceTypes())

/**
 * @type { { [K in TYPES]: K } }
 */
let typesStart

export const ACTION_TYPES = ACTION_TYPES_ARRAY
    .reduce((acc, type) => ({ ...acc, [type]: type }), typesStart)



/**
 * @typedef { { [K in TYPES]: (payload: PAYLOAD_TYPE[K]) => void } } IDecoratedActions
 */

/**
 * @typedef { typeof ACTION_TYPES_DECLARATIONS } PAYLOAD_TYPE
 */

/**
 * @typedef { keyof typeof ACTION_TYPES_DECLARATIONS } TYPES
 */