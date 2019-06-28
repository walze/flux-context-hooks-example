import React, { useState } from 'react'
import { useActions } from '../flux/Actions';
import { generalStore } from '../flux/GeneralStore';
import { ConnectedStoreProps } from '../generics/Store';

const asd = generalStore.createListener(state => ({
  nice: state.word
}))

/**
 * @param props 
 */
const repeater = (props: ConnectedStoreProps<{ word: string }, ReturnType<typeof asd>>) => {
  const { store, word } = props
  const { REPEAT_WORD } = useActions();

  const [localWord, setLocalWord] = useState(word)
  const localRepeat = () => setLocalWord(localWord + localWord)

  const click = () => REPEAT_WORD(store.nice + store.nice)

  const storeJSON = JSON.stringify(store)

  console.log('repeater rendered', props)

  return (
    <>
      <code>Store - {storeJSON}</code>

      <br />
      <br />

      <button onClick={click}>repeat global</button>
      <code>Word - {store.nice}</code>

      <br />

      <button onClick={localRepeat}>repeat word</button>
      <code>Local Word - {localWord}</code>

      <br />
      <br />
      <br />
    </>
  );
}




export const Repeater = generalStore.connect2(
  repeater,
  asd,
)


/**
 * @typedef { {
 *      word: string,
 *  } } IRepeaterProps
 */
