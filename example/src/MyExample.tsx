import React, { useCallback } from 'react'
import { useRootContext } from './contexts/RootContext'
import { changeName } from './reducers/RootReducer'

export const MyExample: React.FC = () => {
  const [state, dispatch] = useRootContext()
  const _handleOnClick = useCallback(() => {
    dispatch(changeName(Date.now().toString()))
  }, [dispatch])
  return (
    <div onClick={_handleOnClick}>{state.name}</div>
  )
}
