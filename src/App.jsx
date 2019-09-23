import React, { useState } from 'react'
import { Repeater } from './components/Repeater'
import { batchDispatch, ACTIONS } from './flux/Actions'
import { generalStore } from './flux/GeneralStore'
import { loadable } from '../lib/helpers'
import { useStoreState } from '../lib/Store'

const { GET_TODO } = ACTIONS

const Loading = ({ string }) => <div>{string}</div>

const Counter = loadable(
  () => import('./components/Counter.jsx').then(({ Counter }) => Counter),
  Loading
)

export const App = () => {
  const [id, setId] = useState(1)
  const todo = useStoreState(generalStore, stt => stt.todo)
  const [show, setShow] = useState(true)

  const batch = () => batchDispatch({
    ADD_COUNTER: 1,
    REPEAT_WORD: 'succ',
  })

  const toggleShow = () => setShow(!show)

  const inputChange = ({ target }) => setId(target.value)

  console.log('app rendered')

  return (
    <>
      <div>
        <p>todo: {JSON.stringify(todo)}</p>
        <input type="number" onChange={inputChange} value={id} />
        <button onClick={() => GET_TODO(id)}>fetch</button>
      </div>

      <div>
        {show && <Counter num={45} string='LOADING' />}
        <button onClick={toggleShow}>toggle show</button>
      </div>

      <Repeater word="test" />
      <button onClick={batch}>batch dispatch</button>
    </>
  )
}
