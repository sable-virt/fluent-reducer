import React, { useCallback } from 'react'
import { update, useChildContext } from './reducers/ChildReducer'
import { changeName, useRootContext } from './reducers/RootReducer'

export const MyExample: React.FC = () => {
  const [state, dispatch] = useRootContext()
  const [childState, childDispatch] = useChildContext()
  const _handleOnClick = useCallback(() => {
    dispatch(changeName(Date.now().toString()))
    window.setTimeout(() => {
      // childDispatch(syncName())
      const upaction = update('hoge')
      // dispatch(upaction)
      childDispatch(upaction)
    }, 1000)
  }, [dispatch, childDispatch])
  return (
    <div onClick={_handleOnClick}>
      <div>{state.name}</div>
      <div>{childState.name}</div>
    </div>
  )
}
