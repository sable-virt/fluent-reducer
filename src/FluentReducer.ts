import produce from 'immer'
import {
  AsyncActionCreator,
  IAction,
  IActionCreator,
  IAsyncFailed, IAsyncHandler,
  IAsyncHandlers,
  IAsyncSucceeded,
} from './AsyncActionCreator'
export type IHandler<InS, P> = (
  state: InS,
  payload: P,
) => void;

export interface IFluentReducerOption<InS> {
  defaultHandler: IHandler<InS, IAction<any>> | undefined
  middlewares: ((state: Readonly<InS>) => void)[]
  prefix: string
  verbose: boolean
}
const DEFAULT_OPTION: IFluentReducerOption<any> = {
  defaultHandler: undefined,
  middlewares: [],
  prefix: '',
  verbose: false
}
export class FluentReducer<ID extends string, InS> {
  protected _option: IFluentReducerOption<InS> = Object.assign({}, DEFAULT_OPTION)
  protected _state: InS
  protected _handle: { [actionType: string]: IHandler<InS, any>; } = {}
  protected _exec: (state: InS, action: IAction<ID>) => InS | any
  constructor(public initialState: InS, op: Partial<IFluentReducerOption<InS>> = {}) {
    Object.assign(this._option, op)
    this._state = produce<any, InS>({}, (draft) => {
      Object.assign(draft, initialState)
    })
    this._exec = (state: InS, action: IAction<ID, InS>) => {
      const handler = this._handle[action.type] || this._option.defaultHandler;
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
  public reducer = (state: InS, action: IAction<ID>): Readonly<InS> => {
    const newState = produce(state, (draft) => {
      return this._exec(draft as InS, action)
    })
    this._option.middlewares.forEach(middleware => {
      middleware(newState)
    })
    this._state = newState
    return Object.freeze(newState)
  }
  public sync<P=void>(type: string, handler: IHandler<InS, P>): IActionCreator<ID, P> {
    return this._caseWithAction<P>(this._option.prefix + type, (state: InS, action: IAction<ID, P>) =>
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
      this._option.prefix + type,
      param,
      handler,
      started,
      failed,
      done
    )
  }
}
