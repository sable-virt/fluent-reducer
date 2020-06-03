import { FluentDispatch } from './FluentDispatcher';
export interface IAction<P = any> {
    type: string;
    payload: P;
}
export interface IAsyncFailed<P, E> {
    params: P;
    error: E;
}
export interface IAsyncSucceeded<P, R> {
    params: P;
    result: R;
}
export interface IAsyncHandlers<S, P, R, E> {
    started: (state: S, params: P) => void;
    failed: (state: S, result: IAsyncFailed<P, E>) => void;
    done: (state: S, result: IAsyncSucceeded<P, R>) => void;
}
export interface IActionCreator<P> {
    (payload: P): IAction<P>;
}
export interface IAsyncHandler<InS, P, R> {
    (params: P, dispatch: FluentDispatch<InS, any, any, any>, getState: () => Readonly<InS>): Promise<R> | R;
}
export declare class AsyncActionCreator<S, P, R, E> {
    type: string;
    param: P;
    handler: IAsyncHandler<S, P, R>;
    started: IActionCreator<P>;
    failed: IActionCreator<IAsyncFailed<P, E>>;
    done: IActionCreator<IAsyncSucceeded<P, R>>;
    constructor(type: string, param: P, handler: IAsyncHandler<S, P, R>, started: IActionCreator<P>, failed: IActionCreator<IAsyncFailed<P, E>>, done: IActionCreator<IAsyncSucceeded<P, R>>);
}
