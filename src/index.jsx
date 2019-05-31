import React from 'react'
import { render } from 'react-dom'

import { Store } from './Store'
import { App } from './App';

const $root = document.querySelector('#root')

const main = (
    <Store>
        <App />
    </Store>
);

render(main, $root)