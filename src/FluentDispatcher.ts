import { Dispatch } from 'react'
import { AsyncActionCreator, IAction } from './AsyncActionCreator'
import { FluentReducer } from './FluentReducer'

export interface FluentDispatch<InS, P, R, E> {
  (action: IAction | AsyncActionCreator<InS, P, R, E>): Promise<R> | R | void
}

export class FluentDispatcher<InS> {
  private _dispatcher: Dispatch<IAction>
  private _reducer: FluentReducer<InS>
  update(dispatcher: Dispatch<IAction>, reducer: FluentReducer<InS>) {
    this._dispatcher = dispatcher
    this._reducer = reducer
  }
  getState() {
    return this._reducer.state
  }
  dispatch<P = any, R = any>(action: IAction | AsyncActionCreator<InS, P, R, any>): Promise<R> | void {
    const dispatch = this._dispatcher
    if (action instanceof AsyncActionCreator) {
      return new Promise<R>(async(resolve, reject) => {
        try {
          dispatch(action.started(action.param))
          const result = await action.handler(action.param, this.dispatch.bind(this), this.getState.bind(this))
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