import React, { Dispatch } from 'react';
import { AsyncActionCreator, IAction, TypeDispatch } from './AsyncActionCreator';
import { FluentReducer } from './FluentReducer';
export declare class FluentDispatcher<T extends string, InS> {
    private _reducer;
    private _dispatcher;
    set dispatcher(_dispatcher: Dispatch<IAction<T>>);
    constructor(_reducer: FluentReducer<T, InS>);
    dispatch(action: IAction<T> | AsyncActionCreator<T, InS, any, any, any>): Promise<any> | void;
}
export declare class ReactFluentReducer<T extends string, InS> extends FluentReducer<T, InS> {
    protected _dispatcher: FluentDispatcher<T, InS>;
    protected _updateDispatcher(dispatcher: Dispatch<IAction<T>>): void;
    createReducerContext: (reducer: FluentReducer<T, InS>) => [React.FC, () => [Readonly<InS>, TypeDispatch<T, InS>]];
    useFluentReducer(reducer: FluentReducer<T, InS>, initializer?: undefined): [InS, TypeDispatch<T, InS>];
}
