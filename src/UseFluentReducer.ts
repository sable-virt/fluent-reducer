import { useMemo, useReducer } from 'react'
import { AsyncActionCreator, IAction } from './AsyncActionCreator'
import { FluentDispatcher } from './FluentDispatcher'
import { FluentReducer } from './index'

export type ReducerResponse<InS> = [Readonly<InS>, DispatchFunction<InS>]
export type DispatchFunction<InS> = (action: IAction | AsyncActionCreator<InS, any, any, any>) => Promise<any> | void
export function useFluentReducer<InS>(reducer: FluentReducer<InS>, initializer?: undefined): ReducerResponse<InS> {
  const [ state, dispatch ] = useReducer(reducer.reducer, reducer.state, initializer)
  const dispatcher = useMemo(() => new FluentDispatcher<InS>(), [])
  dispatcher.update(state, dispatch, reducer)
  const fluentDispatch = dispatcher.dispatch.bind(dispatcher)
  return [
    state,
    fluentDispatch
  ]
}
