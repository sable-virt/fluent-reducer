import { Dispatch } from 'react';
import { AsyncActionCreator, IAction } from './AsyncActionCreator';
export interface FluentDispatch<InS, P> {
    (action: IAction | AsyncActionCreator<InS, any, P, any>): Promise<P> | void;
}
export declare class FluentDispatcher<InS> {
    private _state;
    private _dispatcher;
    update(state: InS, dispatcher: Dispatch<IAction>): void;
    getState(): Readonly<InS>;
    dispatch<P = any>(action: IAction | AsyncActionCreator<InS, any, P, any>): Promise<P> | void;
}
