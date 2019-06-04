import React, { useState } from 'react'
import { useActions } from './Actions';
import { connectStore } from './Store';

/**
 * @typedef { typeof connectStore } nice
 */

/**
 * @template T
 * @type { ReturnType<nice> }
 */
export const Counter = connectStore(({ store }) => {
    const [localCount, setLocalCount] = useState(0)

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
})
