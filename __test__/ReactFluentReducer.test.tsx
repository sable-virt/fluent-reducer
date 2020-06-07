import 'jest'
import React from 'react'
import { render, cleanup } from '@testing-library/react'
import '@testing-library/jest-dom/extend-expect'
import { ReactFluentReducer } from '../src/react'
interface IRootState {
  name: string
  age: number
}
const DEFAULT_STATE: IRootState = {
  name: 'test',
  age: 20
}

afterEach(cleanup)

test('defined', () => {
  const reducer = new ReactFluentReducer<'test',IRootState>(DEFAULT_STATE)
  expect(reducer).toBeDefined()
})

test('useFluentReducer', () => {
  const reducer = new ReactFluentReducer<'test',IRootState>(DEFAULT_STATE)
  const TestComponent: React.FC = () => {
    const [state, dispatch] = reducer.useFluentReducer()
    return (
      <div><div>{state.name}</div><div>{state.age}</div></div>
    )
  }
  const { getByText  } = render(<TestComponent />)
  const name = getByText('test') as any
  expect(name.innerHTML).toBe('test')
  const age = getByText('20') as any
  expect(age.innerHTML).toBe('20')
})
