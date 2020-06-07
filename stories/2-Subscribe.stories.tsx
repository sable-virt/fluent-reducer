import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { ReactFluentReducer } from '../src/react'

export default {
  title: 'Subscribe',
}
interface IRootState {
  name: string
  count: number
}
const DEFAULT_STATE: IRootState = {
  name: 'test',
  count: 0
}

export const Subscribe = () => {
  const reducer = useMemo(() => new ReactFluentReducer<'test', IRootState>(DEFAULT_STATE), [])
  const changeName = useMemo(() => reducer.sync<string>('CHANGE_NAME', (state, name) => {
    state.name = name
  }), [reducer])

  return React.createElement(() => {
    const [state, dispatch] = reducer.useFluentReducer()
    const [count, setCount] = useState(0)
    useEffect(() => {
      reducer.subscribe((state, name) => {
        setCount((count) => {
          return count + 1
        })
      })
      return () => {
        reducer.unsubsribeAll()
      }
    }, [reducer])
    const _handleOnClick = useCallback(() => {
      dispatch(changeName(Date.now().toString()))
    }, [dispatch])
    return (
      <div>
        <button onClick={_handleOnClick}>click</button>
        <div>{state.name} 実行数{count}回</div>
      </div>
    )
  })
}
Subscribe.story = {
  name: 'Subscribe',
}

