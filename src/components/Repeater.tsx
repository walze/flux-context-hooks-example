import React, { useState } from 'react'
import { useActions } from '../flux/Actions';
import { generalStore } from '../flux/GeneralStore';
import { ConnectedStoreProps } from '../generics/Store';

const listener = generalStore.createListener(state => ({
  word: state.word
}))

/**
 * @param props 
 */
const repeater = (props: ConnectedStoreProps<{ word: string }, ReturnType<typeof listener>>) => {
  const { store, word } = props
  const { REPEAT_WORD } = useActions();

  const [localWord, setLocalWord] = useState(word)
  const localClick = () => setLocalWord(localWord + localWord)

  const globalClick = () => REPEAT_WORD(store.word + store.word)

  const storeJSON = JSON.stringify(store)

  console.log('repeater rendered', props)

  return (
    <>
      <code>Store - {storeJSON}</code>

      <br />
      <br />

      <button onClick={globalClick}>repeat global</button>
      <code>Word - {store.word}</code>

      <br />

      <button onClick={localClick}>repeat word</button>
      <code>Local Word - {localWord}</code>

      <br />
      <br />
      <br />
    </>
  );
}




export const Repeater = generalStore.connect(repeater, listener)


/**
 * @typedef { {
 *      word: string,
 *  } } IRepeaterProps
 */
