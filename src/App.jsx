import React from 'react'
import { Counter } from './Counter'
import { Repeater } from './Repeater'

export const App = () => {

    return (
        <>
            <Counter index={1}></Counter>
            <Repeater word={'test'}></Repeater>
        </>
    );
}