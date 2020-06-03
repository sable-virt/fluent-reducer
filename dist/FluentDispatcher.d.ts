import { Dispatch } from 'react';
import { AsyncActionCreator, IAction } from './AsyncActionCreator';
import { FluentReducer } from './FluentReducer';
export interface FluentDispatch<InS, P, R, E> {
    (action: IAction | AsyncActionCreator<InS, P, R, E>): Promise<R> | R | void;
}
export declare class FluentDispatcher<InS> {
    private _dispatcher;
    private _reducer;
    update(dispatcher: Dispatch<IAction>, reducer: FluentReducer<InS>): void;
    getState(): Readonly<InS>;
    dispatch<P = any, R = any>(action: IAction | AsyncActionCreator<InS, P, R, any>): Promise<R> | void;
}
