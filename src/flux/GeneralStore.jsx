import { Store } from '../generics/Store'


const initialState = {
  count: 0,
  word: 'global',
  todo: {},
  obj: {
    a: [],
    b: '2',
  },
}

/**
 * @exports GeneralStore
 * @extends Store<typeof initialState>
 */
export class GeneralStore extends Store {
  constructor() {
    super(initialState)
  }

  /**
   * @param { import('../generics/ActionsCreator')
   *    .IReducerActions<typeof import('./Actions').ACTIONS_DECLARATIONS> } action
   */
  async _reduce(action) {
    const { state } = this
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
}

export const generalStore = new GeneralStore()
