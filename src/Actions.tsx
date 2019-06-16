import { ActionsCreator } from "./generics/ActionsCreator";


const ACTION_TYPES_DECLARATIONS = {
  ADD_COUNTER: 0,
  REMOVE_COUNTER: 0,
  REPEAT_WORD: '',
}

export type PAYLOAD_TYPE = typeof ACTION_TYPES_DECLARATIONS
export type TYPES = keyof typeof ACTION_TYPES_DECLARATIONS

const actions = new ActionsCreator(ACTION_TYPES_DECLARATIONS)

export const {
  ACTIONS_DECLARATIONS,
  ACTION_TYPES_ARRAY,
  useActions,
  ACTION_TYPES,
  batchDispatch,
} = actions
