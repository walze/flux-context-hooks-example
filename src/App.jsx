import React, { useState } from 'react'
import { Repeater } from './components/Repeater'
import { batchDispatch, ACTIONS } from './flux/Actions';
import { generalStore } from './flux/GeneralStore';
import { loadable } from './helpers';
import { useStoreState } from './generics/Store';

const { GET_TODO } = ACTIONS;

const Loading = () => <>LOADING</>

const Counter = loadable({
  loaded: () => import('./components/Counter.jsx').then(({ Counter }) => Counter),
  loading: Loading
})

export const App = () => {
  const [id, setId] = useState(1)
  const todo = useStoreState(generalStore, stt => stt.todo)

  const batch = () => batchDispatch({
    ADD_COUNTER: 1,
    REPEAT_WORD: 'succ',
  })

  const inputChange = ({ target }) => setId(target.value)

  console.log('app rendered')

  return (
    <>
      <div>
        <p>fetch test</p>
        <p>todo: {JSON.stringify(todo)}</p>
        <input type="number" onChange={inputChange} value={id} />
        <button onClick={() => GET_TODO(id)}>fetch</button>
      </div>

      <Counter num={45} />
      <Repeater word="test" />
      <button onClick={batch}>batch dispatch</button>
    </>
  )
}
