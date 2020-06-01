import { useFluentReducer, ReducerResponse } from 'fluent-reducer'
import React, { useContext } from 'react'
import { IChildState, childReducer } from '../reducers/ChildReducer'
interface Props {}

const ChildStateContext = React.createContext<ReducerResponse<IChildState> | null>(null)

export const ChildContext: React.FC<Props> = props => {
  const fluent = useFluentReducer<IChildState>(childReducer)
  return (
    <ChildStateContext.Provider value={fluent}>
      {props.children}
    </ChildStateContext.Provider>
  )
}
export const useChildContext = () => {
  return useContext(ChildStateContext) as ReducerResponse<IChildState>
}
