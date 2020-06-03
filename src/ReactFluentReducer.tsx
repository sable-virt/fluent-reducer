import React, { createContext, Dispatch, useContext, useReducer } from 'react'
import { AsyncActionCreator, IAction, TypeDispatch } from './AsyncActionCreator'
import { FluentReducer } from './FluentReducer'

export class FluentDispatcher<T extends string, InS> {
  private _dispatcher: Dispatch<IAction<T>>
  set dispatcher(_dispatcher: Dispatch<IAction<T>>) {
    this._dispatcher = _dispatcher
  }
  constructor(private _reducer: FluentReducer<T, InS>) {}
  public dispatch(action: IAction<T> | AsyncActionCreator<T, InS, any, any, any>): Promise<any> | void {
    const dispatch = this._dispatcher
    if (!dispatch) throw new Error('undefined dispatcher')
    if (action instanceof AsyncActionCreator) {
      return new Promise<any>(async(resolve, reject) => {
        try {
          dispatch(action.started(action.param))
          const result = await action.handler(action.param, this.dispatch.bind(this), this._reducer.getState.bind(this))
          dispatch(action.done({
            params: action.param,
            result
          }))
          resolve(result)
        } catch(e) {
          dispatch(action.failed({
            params: action.param,
            error: e
          }))
          reject(e)
        }
      })
    } else {
      return dispatch(action)
    }
  }
}

export class ReactFluentReducer<T extends string, InS> extends FluentReducer<T, InS> {
  protected _dispatcher: FluentDispatcher<T, InS> = new FluentDispatcher<T, InS>(this)
  protected _updateDispatcher(dispatcher: Dispatch<IAction<T>>) {
    this._dispatcher.dispatcher = dispatcher
  }
  public createReducerContext = (reducer: FluentReducer<T, InS>): [React.FC, () => [Readonly<InS>, TypeDispatch<T, InS>]] => {
    const StateContext = createContext<[Readonly<InS>, TypeDispatch<T, InS>] | null>(null)
    const component: React.FC = props => {
      const fluent = this.useFluentReducer(reducer)
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
  public useFluentReducer(reducer: FluentReducer<T, InS>, initializer?: undefined): [InS, TypeDispatch<T, InS>] {
    const [ state, dispatch ] = useReducer(reducer.reducer, reducer.initialState, initializer)
    this._updateDispatcher(dispatch)
    const fluentDispatch: TypeDispatch<T, InS> = this._dispatcher.dispatch.bind(this._dispatcher)
    return [
      state,
      fluentDispatch
    ]
  }
}
