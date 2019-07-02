import React, { useState } from 'react'
import { Counter } from './components/Counter'
import { Repeater } from './components/Repeater'
import { batchDispatch, useActions } from './flux/Actions';
import { generalStore } from './flux/GeneralStore';

const { GET_TODO } = useActions();

const listener = generalStore.createListener(stt => ({
  todo: stt.todo,
}))

/**
 * @param { import('./generics/Store')
 *    .ConnectedStoreProps<{}, ReturnType<typeof listener>>
 * } props
 */
const app = (props) => {
  const { store } = props

  const [id, setId] = useState(1)

  const batch = () => batchDispatch({
    ADD_COUNTER: 1,
    REPEAT_WORD: 'succ',
  })

  const inputChange = ({ target }) => setId(target.value)

  return (
    <>
      <div>
        <p>fetch test</p>
        <p>todo: {JSON.stringify(store.todo)}</p>
        <input type="number" onChange={inputChange} value={id} />
        <button onClick={() => GET_TODO(id)}>fetch</button>
      </div>


      <Counter num={45} />
      <Repeater word="test" />
      <button onClick={batch}>batch dispatch</button>
    </>
  )
}


export const App = generalStore.connect(app, listener)
