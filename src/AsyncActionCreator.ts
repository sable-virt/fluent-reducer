import { FluentDispatch } from './FluentDispatcher'

export interface IAction<P=any> {
  type: string
  payload: P
}
export interface IAsyncFailed<P, E> {
  params: P,
  error: E
}
export interface IAsyncSucceeded<P, R> {
  params: P,
  result: R
}
export interface IAsyncHandlers<S, P, R, E> {
  started: (state: S, params: P) => void
  failed: (state: S, result: IAsyncFailed<P, E>) => void
  done: (state: S, result: IAsyncSucceeded<P, R>) => void
}
export interface IActionCreator<P> {
  (payload: P): IAction<P>
}
export interface IAsyncHandler<InS, P, R> {
  (params: P, dispatch: FluentDispatch<InS, P>, getState: () => Readonly<InS>): Promise<R> | R
}
export class AsyncActionCreator<S, P, R, E> {
  constructor(
    public type: string,
    public param: P,
    public handler: IAsyncHandler<S, P, R>,
    public started: IActionCreator<P>,
    public failed: IActionCreator<IAsyncFailed<P, E>>,
    public done: IActionCreator<IAsyncSucceeded<P, R>>,
  ) {}
}