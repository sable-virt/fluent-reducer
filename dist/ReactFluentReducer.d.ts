import React, { Dispatch } from 'react';
import { IAction, TypeDispatch } from './AsyncActionCreator';
import { FluentReducer } from './FluentReducer';
import { ReactFluentDispatcher } from './ReactFluentDispatcher';
export declare class ReactFluentReducer<T extends string, InS> extends FluentReducer<T, InS> {
    protected _dispatcher: ReactFluentDispatcher<T, InS>;
    protected _updateDispatcher(dispatcher: Dispatch<IAction<T>>): void;
    createReducerContext: (initializer?: undefined) => [React.FC, () => [Readonly<InS>, TypeDispatch<T, InS>]];
    useFluentReducer(initializer?: undefined): [InS, TypeDispatch<T, InS>];
}
