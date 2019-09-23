import { Store, createStore } from '../generics/Store'


/**
   * @param { import('../generics/ActionsCreator')
   *    .IReducerActions<typeof import('./Actions').ACTION_TYPES_DECLARATIONS> } action
   * @param { typeof initialState } state
   */
async function _reduce(action, state) {
  const {
    ADD_COUNTER,
    REPEAT_WORD,
    GET_TODO,
  } = action

  console.log(action)

  if (GET_TODO) {
    state.todo = await GET_TODO
  }

  if (ADD_COUNTER) {
    state.count += ADD_COUNTER
  }

  if (REPEAT_WORD) {
    state.word += REPEAT_WORD
  }

  return state
}

const initialState = {
  count: 0,
  word: 'glo2bal',
  todo: {},
  obj: {
    a: [],
    b: 'b',
  },
}

export const generalStore = createStore(
  initialState,
  _reduce
)


const { emitter, onChange, useStore } = generalStore
export {
  emitter,
  onChange,
  useStore,
}
