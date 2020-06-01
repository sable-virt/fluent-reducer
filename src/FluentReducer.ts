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
  defaultHandler: IHandler<InS, IAction> | undefined
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
export class FluentReducer<InS> {
  private _handle: { [actionType: string]: IHandler<InS, any>; } = {}
  private _exec: (state: InS, action: IAction) => InS | any
  private _option:IFluentReducerOption<InS> = Object.assign({}, DEFAULT_OPTION)
  constructor(public initialState: InS, op: Partial<IFluentReducerOption<InS>> = {}) {
    Object.assign(this._option, op)
    this._exec = (state: InS, action: IAction) => {
      const handler = this._handle[action.type] || this._option.defaultHandler;
      if (this._option.verbose) {
        console.log(action)
      }
      return handler ? handler(state, action) : state;
    }
  }
  public reducer = (state: InS, action: IAction): Readonly<InS> => {
    const newState = produce(state, (draft) => {
      return this._exec(draft as InS, action)
    })
    this._option.middlewares.forEach(middleware => {
      middleware(newState)
    })
    return Object.freeze(newState)
  }
  private _caseWithAction<P>(
    type: string,
    handler: IHandler<InS, IAction<P>>,
  ): (payload: P) => IAction<P> {
    this._handle[type] = handler;
    return (payload: P): IAction<P> => {
      return {
        type,
        payload
      }
    }
  }
  sync<P=void>(type: string, handler: IHandler<InS, P>): IActionCreator<P> {
    return this._caseWithAction<P>(type, (state: InS, action: IAction<P>) =>
      handler(state, action.payload)
    )
  }
  async<Param=void, Result=void, Err=Error>(type: string, handler: IAsyncHandler<InS, Param, Result>, handlers: Partial<IAsyncHandlers<InS, Param, Result, Err>> = {}): (param: Param) => AsyncActionCreator<InS, Param, Result, Err> {
    const started = this.sync<Param>(`${this._option.prefix + type}__STARTED`, (state, payload) => {
      if (handlers.started) {
        return handlers.started(state, payload)
      }
      return state
    })
    const failed = this.sync<IAsyncFailed<Param, Err>>(`${this._option.prefix + type}__FAILED`, (state, result) => {
      if (handlers.failed) {
        return handlers.failed(state, result)
      }
      return state
    })
    const done = this.sync<IAsyncSucceeded<Param, Result>>(`${this._option.prefix + type}__DONE`, (state, result) => {
      if (handlers.done) {
        return handlers.done(state, result)
      }
      return state
    })
    return (param: Param): AsyncActionCreator<InS, Param, Result, Err> => new AsyncActionCreator(
      type,
      param,
      handler,
      started,
      failed,
      done
    )
  }
}
