import { useFluentReducer, ReducerResponse } from 'fluent-reducer'
import React, { useContext } from 'react'
import { IRootState, rootReducer } from '../reducers/RootReducer'
interface Props {}

const RootStateContext = React.createContext<ReducerResponse<IRootState> | null>(null)

export const RootContext: React.FC<Props> = props => {
  const fluent = useFluentReducer<IRootState>(rootReducer)
  return (
    <RootStateContext.Provider value={fluent}>
      {props.children}
    </RootStateContext.Provider>
  )
}
export const useRootContext = () => {
  return useContext(RootStateContext) as ReducerResponse<IRootState>
}
