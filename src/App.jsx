import React from 'react'
import { Counter } from './components/Counter'
import { Repeater } from './components/Repeater'
import { batchDispatch, useActions } from './flux/Actions';

const { GET_TODO } = useActions();

export const App = () => {
  const batch = () => batchDispatch({
    ADD_COUNTER: 1,
    REPEAT_WORD: 'succ',
  })

  return (
    <>
      <div>
        <p>fetch test</p>
        <button onClick={() => GET_TODO(1)}>fetch</button>
      </div>


      <Counter num={45} />
      <Repeater word="test" />
      <button onClick={batch}>batch dispatch</button>
    </>
  )
}
