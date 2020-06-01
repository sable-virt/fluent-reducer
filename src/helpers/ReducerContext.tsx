import React, { createContext, useContext } from 'react'
import { FluentReducer } from '../FluentReducer'
import { ReducerResponse, useFluentReducer } from '../UseFluentReducer'

export const createReducerContext = <InS,>(reducer: FluentReducer<InS>): [React.FC, () => ReducerResponse<InS>]=> {
  const StateContext = createContext<ReducerResponse<InS> | null>(null)
  const component: React.FC = props => {
    const fluent = useFluentReducer<InS>(reducer)
    return (
      <StateContext.Provider value={fluent}>
        {props.children}
      </StateContext.Provider>
    )
  }
  const useReducerContext = () => {
    return useContext(StateContext) as ReducerResponse<InS>
  }
  return [
    component,
    useReducerContext
  ]
}

