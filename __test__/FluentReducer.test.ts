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
test('defined', () => {
  const reducer = new FluentReducer<'test',IRootState>(DEFAULT_STATE)
  expect(reducer).toBeDefined()
})
test('sync', () => {
  const reducer = new FluentReducer<'test',IRootState>(DEFAULT_STATE)
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
  const reducer = new FluentReducer<'test', IRootState>(DEFAULT_STATE)
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
test('sync reducer', () => {
  const reducer = new FluentReducer<'test', IRootState>(DEFAULT_STATE)
  const stringAction = reducer.sync<string>('TEST', (state, newName) => {
    state.name = newName
  })
  reducer.reducer(reducer.getState(), stringAction('sable'))
  expect(reducer.getState()).toEqual({
    name: 'sable',
    age: 20,
  })
})
test('async reducer', () => {
  const reducer = new FluentReducer<'test', IRootState>(DEFAULT_STATE)
  const stringAction = reducer.async<string, number>('TEST', (param) => {
    return 21
  }, {
    started(state, params) {
      expect(params).toBe('sable')
      state.name = 'started'
    },
    failed(state, { params, error }) {
      expect(params).toBe('sable')
      expect(error).toEqual(new Error())
      state.name = 'failed'
    },
    done(state, { params, result}) {
      expect(params).toBe('sable')
      expect(result).toBe(21)
      state.name = params
      state.age = result
    }
  })
  reducer.reducer(reducer.getState(), stringAction('sable').started('sable'))
  expect(reducer.getState()).toEqual({
    name: 'started',
    age: 20,
  })

  reducer.reducer(reducer.getState(), stringAction('sable').failed({ params: 'sable', error: new Error() }))
  expect(reducer.getState()).toEqual({
    name: 'failed',
    age: 20,
  })

  reducer.reducer(reducer.getState(), stringAction('sable').done({ params: 'sable', result: 21 }))
  expect(reducer.getState()).toEqual({
    name: 'sable',
    age: 21,
  })
})
