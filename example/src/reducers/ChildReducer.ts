import { ReactFluentReducer } from 'fluent-reducer'
import { AsyncActionCreator } from '../../../src/AsyncActionCreator'
import { rootReducer } from './RootReducer'

export interface IChildState {
  name: string
}
const ChildState: IChildState = {
  name: 'unknown'
}
export const childReducer = new ReactFluentReducer<'child', IChildState>(ChildState, {
  prefix: 'CHILD__',
  verbose: true,
  middlewares: [(state) => {
    console.log(state)
  }]
})
export const [ChildStateContext, useChildContext] = childReducer.createReducerContext(childReducer)
export const update = childReducer.sync<string>('UPDATE', (state, name) => {
  state.name = name
})

export const syncName: (param: void) => AsyncActionCreator<'child', IChildState, any, any, any> = childReducer.async<void, string, void>('ASYNC_CHANGE_NAME', (_, dispatch, getState) => {
  const rootState = rootReducer.getState()
  console.log('root state', rootState)
  return rootState.name
}, {
  done(state, { result }) {
    state.name = result
  }
})
