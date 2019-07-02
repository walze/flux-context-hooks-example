import React, { Component } from 'react'
import { ACTIONS } from '../flux/Actions';
import { generalStore } from '../flux/GeneralStore';

const listener = generalStore.createListener(state => ({
  word: state.word,
}))

const { REPEAT_WORD } = ACTIONS;

/**
 * @extends Component<IRepeaterProps>
 */
class repeater extends Component {
  constructor(props) {
    super(props);

    this.state = {
      word: props.word,
    }

    this.localClick = () => this.setState(prevStt => ({ word: prevStt.word + prevStt.word }))
    this.globalClick = () => REPEAT_WORD(props.store.word + props.store.word)
  }


  render() {
    const { props, state } = this
    const { store } = props

    const storeJSON = JSON.stringify(store)

    console.log('repeater rendered', props)

    return (
      <>
        <code>Store - {storeJSON}</code>

        <br />
        <br />

        <button onClick={this.globalClick}>repeat global</button>
        <code>Word - {store.word}</code>

        <br />

        <button onClick={this.localClick}>repeat word</button>
        <code>Local Word - {state.word}</code>

        <br />
        <br />
        <br />
      </>
    );
  }
}


export const Repeater = generalStore.connect(repeater, listener)

/**
 * @typedef { import('../generics/Store')
 *    .ConnectedStoreProps<{ word: string }, ReturnType<typeof listener>>
 * } IRepeaterProps
 */
