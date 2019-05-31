import React from 'react'
import { Store } from './Store'
import { Counter } from './Counter'

export const App = () => {

    return (
        <Store>
            <Counter></Counter>
        </Store>
    );
}