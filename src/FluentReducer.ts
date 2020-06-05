import produce, { Draft } from 'immer'
import {
  AsyncActionCreator,
  IAction,
  IActionCreator,
  IAsyncFailed, IAsyncHandler,
  IAsyncHandlers,
  IAsyncSucceeded,
} from './AsyncActionCreator'
export type IHandler<InS, P> = (
  state: Draft<InS>,
  payload: P,
) => void;
export interface ListenerFunction<ID extends string, InS> {
  (state: Readonly<InS>, action: IAction<ID>): void
}
export interface IFluentReducerOption<InS> {
  middlewares: ((state: InS, action: IAction<any>) => void)[]
  verbose: boolean
}
const DEFAULT_OPTION: IFluentReducerOption<any> = {
  middlewares: [],
  verbose: false
}
export class FluentReducer<ID extends string, InS> {
  protected _option: IFluentReducerOption<InS> = Object.assign({}, DEFAULT_OPTION)
  protected _listeners: Map<ListenerFunction<ID, InS>, ListenerFunction<ID, InS>> = new Map()
  protected _state: Readonly<InS>
  protected _handle: { [actionType: string]: IHandler<InS, any>; } = {}
  protected _exec: (state: Draft<InS>, action: IAction<ID>) => Draft<InS> | any
  constructor(public initialState: InS, op: Partial<IFluentReducerOption<InS>> = {}) {
    Object.assign(this._option, op)
    this._state = produce<any, InS>({}, (draft) => {
      Object.assign(draft, initialState)
    })
    this._exec = (state: Draft<InS>, action: IAction<ID, InS>) => {
      const handler = this._handle[action.type]
      if (this._option.verbose) {
        console.log(action)
      }
      return handler ? handler(state, action) : state;
    }
  }
  protected _caseWithAction<P>(
    type: string,
    handler: IHandler<InS, IAction<ID, P>>,
  ): (payload: P) => IAction<ID, P> {
    this._handle[type] = handler;
    return (payload: P): IAction<ID, P> => {
      return {
        type,
        payload
      }
    }
  }
  public getState(): Readonly<InS> {
    return Object.freeze(this._state)
  }
  protected _dispatch(action: IAction<ID>) {
    this.reducer(this._state, action)
  }
  public dispatch(action: IAction<ID>): void;
  public dispatch<R=any>(action: AsyncActionCreator<ID, InS, any, R, any>): Promise<R>
  public dispatch<R=any>(action: IAction<ID> | AsyncActionCreator<ID, InS, any, R, any>): Promise<R> | void {
    if (action instanceof AsyncActionCreator) {
      return new Promise<any>(async(resolve, reject) => {
        try {
          this._dispatch(action.started(action.param))
          const result = await action.handler(action.param, this.dispatch.bind(this), this.getState.bind(this))
          this._dispatch(action.done({
            params: action.param,
            result
          }))
          resolve(result)
        } catch(e) {
          this._dispatch(action.failed({
            params: action.param,
            error: e
          }))
          reject(e)
        }
      })
    } else {
      return this._dispatch(action)
    }
  }
  public reducer = (state: InS, action: IAction<ID>): Readonly<InS> => {
    const newState = produce<InS>(state, (draft) => {
      this._exec(draft, action)
      this._option.middlewares.forEach(middleware => {
         middleware(draft as InS, action)
      })
      return draft
    })
    this._state = Object.freeze(newState)
    this._listeners.forEach(listener => {
      listener(this._state, action)
    })
    return this._state
  }
  public sync<P=void>(type: string, handler: IHandler<InS, P>): IActionCreator<ID, P> {
    return this._caseWithAction<P>(type, (state: Draft<InS>, action: IAction<ID, P>) =>
      handler(state, action.payload)
    )
  }
  public async<Param=void, Result=void, Err=Error>(type: string, handler: IAsyncHandler<ID, InS, Param, Result>, handlers: Partial<IAsyncHandlers<InS, Param, Result, Err>> = {}): (param: Param) => AsyncActionCreator<ID, InS, Param, Result, Err> {
    const started = this.sync<Param>(`${type}__STARTED`, (state, payload) => {
      if (handlers.started) {
        return handlers.started(state, payload)
      }
      return state
    })
    const failed = this.sync<IAsyncFailed<Param, Err>>(`${type}__FAILED`, (state, result) => {
      if (handlers.failed) {
        return handlers.failed(state, result)
      }
      return state
    })
    const done = this.sync<IAsyncSucceeded<Param, Result>>(`${type}__DONE`, (state, result) => {
      if (handlers.done) {
        return handlers.done(state, result)
      }
      return state
    })
    return (param: Param): AsyncActionCreator<ID, InS, Param, Result, Err> => new AsyncActionCreator(
      type,
      param,
      handler,
      started,
      failed,
      done
    )
  }
  public subscribe(listener: ListenerFunction<ID, InS>) {
    this._listeners.set(listener, listener)
  }
  public unsubscribe(listener: ListenerFunction<ID, InS>) {
    this._listeners.delete(listener)
  }
  public unsubsribeAll() {
    this._listeners.clear()
  }
}
