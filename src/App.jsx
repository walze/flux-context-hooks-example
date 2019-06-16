import React from 'react'
import { Counter } from './components/Counter'
import { Repeater } from './components/Repeater'
import { batchDispatch } from './flux/Actions';

export const App = () => {
  const batch = () => batchDispatch({
    ADD_COUNTER: 1,
    REPEAT_WORD: 'succ',
  })

  return (
    <>
      <Counter num={45} />
      <Repeater word="test" />
      <button onClick={batch}>batch dispatch</button>
    </>
  )
}
