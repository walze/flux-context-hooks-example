// eslint-disable-next-line import/no-unresolved
import { Store } from '../generics/Store'


const initialState = {
  count: 0,
  word: 'global',
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
   * @param { Partial<import('./Actions').ACTIONS_DECLARATIONS> } action
   */
  _reduce(action) {
    const { state } = this
    const {
      ADD_COUNTER,
      REPEAT_WORD,
    } = action


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
