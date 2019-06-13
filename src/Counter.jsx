import React, { useState } from 'react'
import { useActions } from './Actions';
import { generalStore } from './GeneralStore';


/**
 * @type { import('./generics/Store').ConnectedStore<ICounterProps, typeof generalStore["state"]> }
 */
const counter = (props) => {
  const { store, num } = props
  const { ADD_COUNTER } = useActions();

  const [localCount, setLocalCount] = useState(0)
  const localAdd = () => setLocalCount(localCount + localCount || 1)

  const click = () => ADD_COUNTER(store.count || 1)

  const storeJSON = JSON.stringify(store)

  console.log('counter rendered')

  return (
    <>
      <p>num - {num}</p>
      <code>Store - {storeJSON}</code>

      <br />
      <br />

      <button onClick={click}>add global</button>
      <code>Counter - {store.count}</code>

      <br />

      <button onClick={localAdd}>add counter</button>
      <code>Local Counter - {localCount}</code>

      <br />
      <br />
      <br />
    </>
  );
}

export const Counter = generalStore.connect(
  counter,
)


/**
 * @typedef { {
 *      num: number,
 *  } } ICounterProps
 */
