import React, { useState } from 'react'
import { useStore } from './Store';
import { useActions } from './Actions';

export const Counter = () => {
    const [localCount, setLocalCount] = useState(0)

    const store = useStore();
    const { ADD_COUNTER } = useActions();

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
