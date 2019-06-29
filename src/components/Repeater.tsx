import React, { Component } from 'react'
import { useActions } from '../flux/Actions';
import { generalStore } from '../flux/GeneralStore';
import { ConnectedStoreProps } from '../generics/Store';

const listener = generalStore.createListener(state => ({
  word: state.word
}))

class repeater extends Component<ConnectedStoreProps<IRepeaterProps, ReturnType<typeof listener>>> {
  state = {
    word: this.props.word
  }

  render() {
    const { props } = this
    const { store } = props
    const { REPEAT_WORD } = useActions();

    const localClick = () => this.setState({ word: this.state.word + this.state.word })
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
        <code>Local Word - {this.state.word}</code>

        <br />
        <br />
        <br />
      </>
    );
  }
}




export const Repeater = generalStore.connect(repeater, listener)

interface IRepeaterProps {
  word: string,
}
