import { Dispatch } from 'react';
import { AsyncActionCreator, IAction } from './AsyncActionCreator';
import { FluentReducer } from './FluentReducer';
export interface FluentDispatch<InS, P> {
    (action: IAction | AsyncActionCreator<InS, any, P, any>): Promise<P> | void;
}
export declare class FluentDispatcher<InS> {
    private _dispatcher;
    private _reducer;
    update(state: InS, dispatcher: Dispatch<IAction>, reducer: FluentReducer<InS>): void;
    getState(): Readonly<InS>;
    dispatch<P = any>(action: IAction | AsyncActionCreator<InS, any, P, any>): Promise<P> | void;
}
