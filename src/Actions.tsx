import { dispatch } from "./dispatcher";
import { objectKeys } from './helpers'


const ACTION_TYPES_DECLARATIONS = {
  ADD_COUNTER: 0,
  REMOVE_COUNTER: 0,
  REPEAT_WORD: '',
}

export type PAYLOAD_TYPE = typeof ACTION_TYPES_DECLARATIONS
export type TYPES = keyof typeof ACTION_TYPES_DECLARATIONS
export type IDecoratedActions = { [K in TYPES]: (payload: PAYLOAD_TYPE[K]) => void }

const ACTION_TYPES_ARRAY = objectKeys(ACTION_TYPES_DECLARATIONS)


let typesStartValue: IDecoratedActions

const reduceTypes = () => ACTION_TYPES_ARRAY
  .reduce(
    (acc, type) => {
      const dispatchFn = (payload: unknown) => dispatch({ type, payload })

      return { ...acc, [type]: dispatchFn }
    },
    typesStartValue
  )

export const useActions = (() => {
  const reducedTypes: IDecoratedActions = reduceTypes()

  return () => reducedTypes
})()

let typesStart = {} as { [K in TYPES]: K }

export const ACTION_TYPES = ACTION_TYPES_ARRAY
  .reduce((acc, type) => ({ ...acc, [type]: type }), typesStart)



