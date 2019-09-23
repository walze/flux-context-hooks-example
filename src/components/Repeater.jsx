import React, { Component, useState } from 'react'
import { ACTIONS } from '../flux/Actions'
import { useStore, generalStore } from '../flux/GeneralStore'
import { connectStore } from '../../lib/Store'

const { REPEAT_WORD } = ACTIONS

/**
 * @extends Component<IRepeaterProps>
 */
const repeater = (props) => {
  console.log(props)
  const [state, _setState] = useState({
    word: props.word,
  })
  const setState = obj => _setState({ ...state, ...obj })

  const store = useStore()

  const localClick = () => setState(prevStt => ({ word: prevStt.word + prevStt.word }))
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
      <code>Local Word - {state.word}</code>

      <br />
      <br />
      <br />
    </>
  )
}


export const Repeater = connectStore(
  generalStore,
  ({ word }) => ({ word }),
  repeater,
)
