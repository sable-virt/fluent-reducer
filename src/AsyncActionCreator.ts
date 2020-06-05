import { Draft } from 'immer'

export interface IAction<T extends string, P=any> {
  _?: T
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
  started: (state: Draft<S>, params: P) => void
  failed: (state: Draft<S>, result: IAsyncFailed<P, E>) => void
  done: (state: Draft<S>, result: IAsyncSucceeded<P, R>) => void
}
export interface IActionCreator<T extends string, P> {
  _?: T
  (payload: P): IAction<T, P>
}
export interface TypeDispatch<T extends string, InS> {
  (action: IAction<T>): void
  <R=any>(action: AsyncActionCreator<T, InS, any, R, any>): Promise<R>
}
export interface IAsyncHandler<T extends string, InS, P, R> {
  _?: T
  (params: P, dispatch: TypeDispatch<T, InS>, getState: () => Readonly<InS>): Promise<R> | R
}
export class AsyncActionCreator<T extends string, S, P, R, E> {
  constructor(
    public type: string,
    public param: P,
    public handler: IAsyncHandler<T, S, P, R>,
    public started: IActionCreator<T, P>,
    public failed: IActionCreator<T, IAsyncFailed<P, E>>,
    public done: IActionCreator<T, IAsyncSucceeded<P, R>>,
  ) {}
}
