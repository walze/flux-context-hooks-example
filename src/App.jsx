import React from 'react'
import { Counter } from './Counter'
import { Repeater } from './Repeater'
import { batchDispatch } from './Actions';

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
