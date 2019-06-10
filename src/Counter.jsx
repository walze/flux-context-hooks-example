import React, { useState } from 'react'
import { useActions } from './Actions';
import { connectStore } from './Store';



/**
 * @param { import('./Store').ConnectedStore<ICounterProps> } props 
 */
const counter = (props) => {
    const { store, index } = props
    const { ADD_COUNTER } = useActions();

    const [localCount, setLocalCount] = useState(0)
    const localAdd = () => setLocalCount(localCount + localCount || 1)

    const click = () => ADD_COUNTER(store.count || 1)

    const storeJSON = JSON.stringify(store)

    console.log('counter rendered')

    return (
        <>
            <p>Index - {index}</p>
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

export const Counter = connectStore(counter)



/**
 * @typedef { {
 *      index: number,
 *  } } ICounterProps
 */