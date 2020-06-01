import { Dispatch } from 'react'
import { AsyncActionCreator, IAction } from './AsyncActionCreator'

export interface FluentDispatch<InS, P> {
  (action: IAction | AsyncActionCreator<InS, any, P, any>): Promise<P> | void
}

export class FluentDispatcher<InS> {
  private _state: InS
  private _dispatcher: Dispatch<IAction>
  update(state: InS, dispatcher: Dispatch<IAction>) {
    this._state = state
    this._dispatcher = dispatcher
  }
  getState() {
    return Object.freeze(this._state)
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