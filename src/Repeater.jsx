import React, { useState } from 'react'
import { useActions } from './Actions';
import { generalStore } from './GeneralStore';


/**
 * @type {  import('./generics/Store').ConnectedStore<IRepeaterProps, typeof generalStore["state"]>
 *  }
 */
const repeater = (props) => {
  const { store, word } = props
  const { REPEAT_WORD } = useActions();

  const [localWord, setLocalWord] = useState(word)
  const localRepeat = () => setLocalWord(localWord + localWord)

  const click = () => REPEAT_WORD(store.word + store.word)

  const storeJSON = JSON.stringify(store)

  console.log('repeater rendered', props)

  return (
    <>
      <code>Store - {storeJSON}</code>

      <br />
      <br />

      <button onClick={click}>repeat global</button>
      <code>Word - {store.word}</code>

      <br />

      <button onClick={localRepeat}>repeat word</button>
      <code>Local Word - {localWord}</code>

      <br />
      <br />
      <br />
    </>
  );
}

export const Repeater = generalStore.connect(
  repeater,
  [
    'word',
  ],
)


/**
 * @typedef { {
 *      word: string,
 *  } } IRepeaterProps
 */
