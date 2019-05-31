import React, { useState, useEffect } from 'react'
import { useActions } from './Actions';
import { useFlux } from './Store';

export const Counter = () => {
    const [localCount, setLocalCount] = useState(0)

    const [getStore, onChange] = useFlux()
    const [state, setState] = useState(getStore());

    useEffect(() => onChange(setState), [])

    const { ADD_COUNTER } = useActions();

    const click = () => ADD_COUNTER(state.count || 1)
    const localAdd = () => setLocalCount(localCount + localCount || 1)

    return (
        <>
            <code>Store - {JSON.stringify(state)}</code>
            <br />

            <br />

            <button onClick={click}>add global</button>
            <code>Counter - {state.count}</code>

            <br />

            <button onClick={localAdd}>add counter</button>
            <code>Local Counter - {localCount}</code>
        </>
    );
}
