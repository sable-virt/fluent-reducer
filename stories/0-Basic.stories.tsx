import React, { useCallback, useMemo } from 'react'
import { ReactFluentReducer } from '../src'
export default {
  title: 'Basic',
}
interface IRootState {
  name: string
  age: number
  status: string
}
const DEFAULT_STATE: IRootState = {
  name: 'test',
  age: 20,
  status: 'wait'
}

export const SyncAction = () => {
  const reducer = useMemo(() => new ReactFluentReducer<'test', IRootState>(DEFAULT_STATE), [])
  const changeName = useMemo(() => reducer.sync<string>('TEST', (state, name) => {
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
        <div>{state.name}</div>
      </div>
    )
  })
}
SyncAction.story = {
  name: 'Sync Action',
}

export const AsyncAction = () => {
  const reducer = useMemo(() => new ReactFluentReducer<'test', IRootState>(DEFAULT_STATE), [])
  const changeName = useMemo(() => reducer.async<string, string, Error>('TEST', (name) => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (name) {
          resolve(name)
        } else {
          reject(new Error('name is required'))
        }
      }, 2000)
    })
  }, {
    started(state, name) {
      state.status = 'started'
    },
    failed(state, { error }) {
      console.error(error)
      state.status = 'failed'
    },
    done(state, { result }) {
      state.name = result
      state.status = 'done'
    }
  }), [reducer])
  return React.createElement(() => {
    const [state, dispatch] = reducer.useFluentReducer()
    const _handleOnClick = useCallback(() => {
      dispatch(changeName(Date.now().toString()))
    }, [dispatch])
    return (
      <div>
        <button onClick={_handleOnClick} disabled={state.status === 'started'}>click</button>
        <div>{state.status}: {state.name}</div>
      </div>
    )
  })
}
AsyncAction.story = {
  name: 'Async Action',
}
