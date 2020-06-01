import { FluentReducer } from 'fluent-reducer'

export interface IRootState {
  name: string
}
const RootState: IRootState = {
  name: 'unknown'
}
export const rootReducer = new FluentReducer<IRootState>(RootState, {
  verbose: true
})
export const changeName = rootReducer.sync('CHANGE_NAME', (state, name) => {
  state.name = name
})
