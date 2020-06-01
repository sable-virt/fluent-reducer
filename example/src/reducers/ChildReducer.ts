import { FluentReducer, createReducerContext } from 'fluent-reducer'
import { rootReducer } from './RootReducer'

export interface IChildState {
  name: string
}
const ChildState: IChildState = {
  name: 'unknown'
}
export const childReducer = new FluentReducer<IChildState>(ChildState, {
  prefix: 'CHILD__',
  verbose: true,
  middlewares: [(state) => {
    console.log(state)
  }]
})
export const [ChildStateContext, useChildContext] = createReducerContext<IChildState>(childReducer)
export const syncName = childReducer.async<void, string, void>('ASYNC_CHANGE_NAME', (_, dispatch, getState) => {
  console.log('root state', rootReducer.state)
  return rootReducer.state.name
}, {
  done(state, { result }) {
    state.name = result
  }
})
