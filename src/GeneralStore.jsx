// eslint-disable-next-line import/no-unresolved
import { Store } from './generics/Store'


const initialState = {
  count: 0,
  word: 'global',
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
   * @param { import('./generics/Store').Action } action
   */
  _reduce(action) {
    const {
      ADD_COUNTER,
      REPEAT_WORD,
    } = action

    const { state } = this

    if (ADD_COUNTER) {
      state.count += ADD_COUNTER

      return state
    }

    if (REPEAT_WORD) {
      state.word += REPEAT_WORD

      return state
    }

    // eslint-disable-next-line no-console
    console.error('Unknown Type', action)

    throw new Error('Dispached unknown type')
  }
}


export const generalStore = new GeneralStore()
