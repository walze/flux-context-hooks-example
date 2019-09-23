import { createActions } from "../generics/ActionsCreator"


export const ACTION_TYPES_DECLARATIONS = {
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
  batchDispatch,
  Actions: ACTIONS,
} = createActions(ACTION_TYPES_DECLARATIONS)

// eslint-disable-next-line no-console
console.log(ACTIONS)
