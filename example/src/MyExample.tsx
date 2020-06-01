import React, { useCallback } from 'react'
import { FluentReducer, useFluentReducer } from 'fluent-reducer'

interface ROOT_STATE {
  state: string
}
const DEFAULT_STATE: ROOT_STATE = {
  state: 'aaaa'
}

const reducer = new FluentReducer<ROOT_STATE>({
  verbose: true
})
const changeState = reducer.sync<string>('CHANGE_STATE', (state, payload) => {
  state.state = payload
})
const asyncChangeState = reducer.async<string, string, Error>('ASYNC_CHANGE_STATE', (params,dispatch, getState) => {
  return new Promise(resolve => {
    dispatch(changeState('wait'))
    setTimeout(() => {
      dispatch(changeState('time'))
      resolve(params)
    }, 3000)
  })
}, {
  started(state, params) {
    console.log('started')
    // state.state = 'started'
  },
  done(state, result) {
    state.state = result.result
    console.log('done')
  }
})

export const MyExample: React.FC = () => {
  const [state, dispatch] = useFluentReducer(reducer, DEFAULT_STATE)
  const _handleOnClick = useCallback(() => {
    dispatch(changeState('ready'))
    dispatch(asyncChangeState('done'))
  }, [dispatch])
  return (
    <div onClick={_handleOnClick}>{state.state}</div>
  )
}