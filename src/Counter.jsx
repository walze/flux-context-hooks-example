import React, { useState, useEffect } from 'react'
import { useActions } from './Actions';
import { useFlux } from './Store';


/**
 * @template T, S
 * @param { T } c 
 * @returns { T }
 */
const stored = c => {
    const [getStore, onChange] = useFlux()

    /**
     * @param { S } props 
     */
    const newComponent = (props) => {
        const [state, setState] = useState(getStore());

        useEffect(() => {
            console.log(123)

            return onChange(setState)
        }, [])

        return c({ ...props, store: state })
    }

    return newComponent
}

export const Counter = stored((props) => {
    const [localCount, setLocalCount] = useState(0)

    const { ADD_COUNTER } = useActions();

    const click = () => ADD_COUNTER(props.store.count || 1)
    const localAdd = () => setLocalCount(localCount + localCount || 1)

    return (
        <>
            <code>Store - {JSON.stringify(props.store)}</code>

            <br />

            <button onClick={click}>add global</button>
            <code>Counter - {props.store.count}</code>

            <br />

            <button onClick={localAdd}>add counter</button>
            <code>Local Counter - {localCount}</code>
        </>
    );
})
