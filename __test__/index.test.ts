import 'jest'
import { FluentReducer } from '../src'
interface IRootState {
  name: string
  age: number
}
const DEFAULT_STATE: IRootState = {
  name: 'test',
  age: 20
}
test('basic', () => {
  const reducer = new FluentReducer<IRootState>(DEFAULT_STATE)
  expect(reducer).toBeDefined()
})
test('sync', () => {
  const reducer = new FluentReducer<IRootState>(DEFAULT_STATE)
  const stringAction = reducer.sync<string>('TEST', (state) => {})
  expect(stringAction('test')).toEqual({
    type: 'TEST',
    payload: 'test'
  })
  const numberAction = reducer.sync<number>('TEST', (state) => {})
  expect(numberAction(2)).toEqual({
    type: 'TEST',
    payload: 2
  })
})
test('async', () => {
  const reducer = new FluentReducer<IRootState>(DEFAULT_STATE)
  const handler = () => { return 0 }
  const NAME = 'ASYNC_TEST'
  const PARAM = 'hoge'
  const asyncAction = reducer.async<string, number, any>(NAME, handler)
  expect(asyncAction).toBeDefined()
  const action = asyncAction(PARAM)
  expect(action.type).toBe(NAME)
  expect(action.handler).toBe(handler)
  expect(action.param).toBe(PARAM)
  expect(action.started(PARAM)).toEqual({
    type: `${NAME}__STARTED`,
    payload: PARAM
  })
  const err = new Error()
  expect(action.failed({
    params: PARAM,
    error: err
  })).toEqual({
    type: `${NAME}__FAILED`,
    payload: {
      params: PARAM,
      error: err
    }
  })
  expect(action.done({
    params: PARAM,
    result: 0
  })).toEqual({
    type: `${NAME}__DONE`,
    payload: {
      params: PARAM,
      result: 0
    }
  })
})
test('prefix', () => {
  const reducer = new FluentReducer<IRootState>(DEFAULT_STATE, {
    prefix: 'MY_PREFIX__'
  })
  const stringAction = reducer.sync<string>('TEST', (state) => {})
  expect(stringAction('test')).toEqual({
    type: 'MY_PREFIX__TEST',
    payload: 'test'
  })

  const asyncAction = reducer.async<string, number>('TEST_ASYNC', (state) => { return 0 })
  const PARAM = 'param'
  const action = asyncAction(PARAM)
  expect(action.type).toBe('MY_PREFIX__TEST_ASYNC')
  expect(action.started(PARAM)).toEqual({
    type: 'MY_PREFIX__TEST_ASYNC__STARTED',
    payload: PARAM
  })
  expect(action.failed({ params: PARAM, error: new Error()})).toEqual({
    type: 'MY_PREFIX__TEST_ASYNC__FAILED',
    payload: { params: PARAM, error: new Error()}
  })
  expect(action.done({params: PARAM, result: 0})).toEqual({
    type: 'MY_PREFIX__TEST_ASYNC__DONE',
    payload: {params: PARAM, result: 0}
  })
})