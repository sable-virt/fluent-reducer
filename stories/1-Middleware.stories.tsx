import React, { useCallback, useMemo } from 'react'
import { ReactFluentReducer } from '../src/react'

export default {
  title: 'Middleware',
}
interface IRootState {
  name: string
  count: number
}
const DEFAULT_STATE: IRootState = {
  name: 'test',
  count: 0
}
export const Middleware = () => {
  const reducer = useMemo(() => new ReactFluentReducer<'test', IRootState>(DEFAULT_STATE, {
    middlewares: [
      (state, action) => {
        state.count++
      }
    ]
  }), [])
  const changeName = useMemo(() => reducer.sync<string>('CHANGE_NAME', (state, name) => {
    state.name = name
  }), [reducer])

  return React.createElement(() => {
    const [state, dispatch] = reducer.useFluentReducer()
    const _handleOnClick = useCallback(() => {
      dispatch(changeName(Date.now().toString()))
    }, [dispatch])
    return (
      <div>
        <button onClick={_handleOnClick}>click</button>
        <div>{state.name} 実行数{state.count}回</div>
      </div>
    )
  })
}
Middleware.story = {
  name: 'Middlewares',
}
