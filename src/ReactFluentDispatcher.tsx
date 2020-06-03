import React, { Dispatch } from 'react'
import { AsyncActionCreator, IAction } from './AsyncActionCreator'
import { ReactFluentReducer } from './ReactFluentReducer'

export class ReactFluentDispatcher<T extends string, InS> {
  private _dispatcher: Dispatch<IAction<T>>
  set dispatcher(_dispatcher: Dispatch<IAction<T>>) {
    this._dispatcher = _dispatcher
  }
  constructor(private _reducer: ReactFluentReducer<T, InS>) {}
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
