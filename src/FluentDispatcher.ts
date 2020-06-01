import { Dispatch } from 'react'
import { AsyncActionCreator, IAction } from './AsyncActionCreator'
import { FluentReducer } from './FluentReducer'

export interface FluentDispatch<InS, P> {
  (action: IAction | AsyncActionCreator<InS, any, P, any>): Promise<P> | void
}

export class FluentDispatcher<InS> {
  private _dispatcher: Dispatch<IAction>
  private _reducer: FluentReducer<InS>
  update(state: InS, dispatcher: Dispatch<IAction>, reducer: FluentReducer<InS>) {
    this._dispatcher = dispatcher
    this._reducer = reducer
  }
  getState() {
    return this._reducer.state
  }
  dispatch<P = any>(action: IAction | AsyncActionCreator<InS, any, P, any>): Promise<P> | void {
    const dispatch = this._dispatcher
    if (action instanceof AsyncActionCreator) {
      return new Promise<P>(async(resolve, reject) => {
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