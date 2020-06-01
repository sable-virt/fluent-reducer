import 'jest'
import { FluentReducer } from '../src'
interface IRootState {
  hoge: 'test'
}
test('basic', () => {
  const reducer = new FluentReducer<IRootState>()
  expect(reducer).toBeDefined()
})
test('sync', () => {
  const reducer = new FluentReducer<IRootState>()
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
  const reducer = new FluentReducer<IRootState>()
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

test('multiple', () => {
  const reducer = new FluentReducer<IRootState>()
  const reducer2 = new FluentReducer<IRootState>()

  const stringAction = reducer.sync<string>('TEST', (state) => {})
  expect(stringAction('test')).toEqual({
    type: 'TEST',
    payload: 'test'
  })
  const stringAction2 = reducer.sync<string>('TEST', (state) => {})
  expect(stringAction2('test')).toEqual({
    type: 'TEST',
    payload: 'test'
  })
})