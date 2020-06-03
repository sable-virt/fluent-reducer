import { FluentReducer, createReducerContext } from 'fluent-reducer'

export interface IRootState {
  name: string
}
const RootState: IRootState = {
  name: 'unknown'
}
export const rootReducer = new FluentReducer<IRootState>(RootState, {
  verbose: true,
  middlewares: [(state) => {
    console.log(state)
  }]
})
export const [RootStateContext, useRootContext] = createReducerContext<IRootState>(rootReducer)

export const changeName = rootReducer.sync<string>('CHANGE_NAME', (state, name) => {
  state.name = name
})

export const asyncChangeName = rootReducer.async<number, number>('ASYNC_CHANGE_NAME', (name, dispatch) => {
  dispatch(changeName('test'))
  return 0
})
export const asyncChangeName2 = rootReducer.async<string, string>('ASYNC_CHANGE_NAME', async(name, dispatch) => {
  const num = await dispatch(asyncChangeName(222))
  return String(num)
})
