import React from 'react'
import { Counter } from './Counter'
import { Repeater } from './Repeater'

export const App = () => (
  <>
    <Counter num={45} />
    <Repeater word="test" />
  </>
)
