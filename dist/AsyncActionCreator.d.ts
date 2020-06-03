export interface IAction<T extends string, P = any> {
    _?: T;
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
export interface IActionCreator<T extends string, P> {
    _?: T;
    (payload: P): IAction<T, P>;
}
export declare type TypeDispatch<T extends string, InS> = (action: IAction<T> | AsyncActionCreator<T, InS, any, any, any>) => Promise<any> | void;
export interface IAsyncHandler<T extends string, InS, P, R> {
    _?: T;
    (params: P, dispatch: TypeDispatch<T, InS>, getState: () => Readonly<InS>): Promise<R> | R;
}
export declare class AsyncActionCreator<T extends string, S, P, R, E> {
    type: string;
    param: P;
    handler: IAsyncHandler<T, S, P, R>;
    started: IActionCreator<T, P>;
    failed: IActionCreator<T, IAsyncFailed<P, E>>;
    done: IActionCreator<T, IAsyncSucceeded<P, R>>;
    constructor(type: string, param: P, handler: IAsyncHandler<T, S, P, R>, started: IActionCreator<T, P>, failed: IActionCreator<T, IAsyncFailed<P, E>>, done: IActionCreator<T, IAsyncSucceeded<P, R>>);
}
