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
