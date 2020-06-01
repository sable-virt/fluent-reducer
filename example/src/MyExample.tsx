import React, { useCallback } from 'react'
import { useChildContext } from './contexts/ChildContext'
import { useRootContext } from './contexts/RootContext'
import { syncName } from './reducers/ChildReducer'
import { changeName } from './reducers/RootReducer'

export const MyExample: React.FC = () => {
  const [state, dispatch] = useRootContext()
  const [childState, childDispatch] = useChildContext()
  const _handleOnClick = useCallback(() => {
    dispatch(changeName(Date.now().toString()))
    window.setTimeout(() => {
      childDispatch(syncName())
    }, 1000)
  }, [dispatch, childDispatch])
  return (
    <div onClick={_handleOnClick}>
      <div>{state.name}</div>
      <div>{childState.name}</div>
    </div>
  )
}
