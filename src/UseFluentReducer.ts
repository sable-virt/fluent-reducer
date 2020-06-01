import { useMemo, useReducer } from 'react'
import { FluentDispatcher } from './FluentDispatcher'
import { FluentReducer } from './index'

export function useFluentReducer<InS>(reducer: FluentReducer<InS>, initialState: InS, initializer?: undefined) {
  const [ state, dispatch ] = useReducer(reducer.reducer, initialState, initializer)
  const dispatcher = useMemo(() => new FluentDispatcher<InS>(), [])
  dispatcher.update(state, dispatch)
  const fluentDispatch = dispatcher.dispatch.bind(dispatcher)
  return [
    state,
    fluentDispatch
  ]
}
