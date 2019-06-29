import { ActionsCreator } from "../generics/ActionsCreator";


const ACTION_TYPES_DECLARATIONS = {
  ADD_COUNTER: 0,
  REMOVE_COUNTER: 0,
  REPEAT_WORD: '',
}

export const {
  ACTIONS_DECLARATIONS,
  ACTION_TYPES,
  ACTION_TYPES_ARRAY,
  batchDispatch,
  useActions,
} = new ActionsCreator(ACTION_TYPES_DECLARATIONS)
