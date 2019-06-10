import React, { useState } from 'react'
import { useActions } from './Actions';
import { connectStore } from './Store';

/**
 * @param { import('./Store').ConnectedStore<{nice: string}> } props 
 */
const counter = (props) => {
    const { store } = props
    const { ADD_COUNTER } = useActions();

    const [localCount, setLocalCount] = useState(0)

    const click = () => ADD_COUNTER(store.count || 1)
    const localAdd = () => setLocalCount(localCount + localCount || 1)

    return (
        <>
            <code>Store - {JSON.stringify(store)}</code>

            <br />

            <button onClick={click}>add global</button>
            <code>Counter - {store.count}</code>

            <br />

            <button onClick={localAdd}>add counter</button>
            <code>Local Counter - {localCount}</code>
        </>
    );
}

export const Counter = connectStore(counter)
