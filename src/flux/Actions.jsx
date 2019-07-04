import { ActionsCreator } from '../generics/ActionsCreator';


const ACTION_TYPES_DECLARATIONS = {
  ADD_COUNTER: 0,
  REMOVE_COUNTER: 0,
  REPEAT_WORD: '',
  /** @param {number} id */
  GET_TODO(id) {
    const api = `https://jsonplaceholder.typicode.com/todos/${id}`

    return fetch(api).then(r => r.json())
  },
}

export const {
  ACTIONS_DECLARATIONS,
  ACTION_TYPES,
  ACTION_TYPES_ARRAY,
  batchDispatch,
  ACTIONS,
} = new ActionsCreator(ACTION_TYPES_DECLARATIONS)

// eslint-disable-next-line no-console
console.log(ACTIONS)