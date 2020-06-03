import React, { createContext, Dispatch, useContext, useMemo, useReducer } from 'react'
import { IAction, TypeDispatch } from './AsyncActionCreator'
import { FluentReducer } from './FluentReducer'
import { ReactFluentDispatcher } from './ReactFluentDispatcher'

export class ReactFluentReducer<T extends string, InS> extends FluentReducer<T, InS> {
  protected _dispatcher: ReactFluentDispatcher<T, InS> = new ReactFluentDispatcher<T, InS>(this)
  protected _updateDispatcher(dispatcher: Dispatch<IAction<T>>) {
    this._dispatcher.dispatcher = dispatcher
  }
  public createReducerContext = (initializer?: undefined): [React.FC, () => [Readonly<InS>, TypeDispatch<T, InS>]] => {
    const StateContext = createContext<[Readonly<InS>, TypeDispatch<T, InS>] | null>(null)
    const component: React.FC = props => {
      const fluent = this.useFluentReducer(initializer)
      return (
        <StateContext.Provider value={fluent}>
          {props.children}
        </StateContext.Provider>
      )
    }
    const useReducerContext = () => {
      return useContext(StateContext) as [Readonly<InS>, TypeDispatch<T, InS>]
    }
    return [
      component,
      useReducerContext
    ]
  }
  public useFluentReducer(initializer?: undefined): [InS, TypeDispatch<T, InS>] {
    const [ state, dispatch ] = useReducer(this.reducer, this.initialState, initializer)
    const fluentDispatch: TypeDispatch<T, InS> = useMemo(() => {
      this._updateDispatcher(dispatch)
      return this._dispatcher.dispatch.bind(this._dispatcher)
    }, [dispatch])
    return [
      state,
      fluentDispatch
    ]
  }
}
