import { Dispatch } from 'react';
import { AsyncActionCreator, IAction } from './AsyncActionCreator';
import { ReactFluentReducer } from './ReactFluentReducer';
export declare class ReactFluentDispatcher<T extends string, InS> {
    private _reducer;
    private _dispatcher;
    set dispatcher(_dispatcher: Dispatch<IAction<T>>);
    constructor(_reducer: ReactFluentReducer<T, InS>);
    dispatch(action: IAction<T>): void;
    dispatch<R = any>(action: AsyncActionCreator<T, InS, any, R, any>): Promise<R>;
}
