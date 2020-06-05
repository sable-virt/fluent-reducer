import { Draft } from 'immer';
import { AsyncActionCreator, IAction, IActionCreator, IAsyncHandler, IAsyncHandlers } from './AsyncActionCreator';
export declare type IHandler<InS, P> = (state: Draft<InS>, payload: P) => void;
export interface ListenerFunction<ID extends string, InS> {
    (state: Readonly<InS>, action: IAction<ID>): void;
}
export interface IFluentReducerOption<InS> {
    middlewares: ((state: InS, action: IAction<any>) => void)[];
    verbose: boolean;
}
export declare class FluentReducer<ID extends string, InS> {
    initialState: InS;
    protected _option: IFluentReducerOption<InS>;
    protected _listeners: Map<ListenerFunction<ID, InS>, ListenerFunction<ID, InS>>;
    protected _state: Readonly<InS>;
    protected _handle: {
        [actionType: string]: IHandler<InS, any>;
    };
    protected _exec: (state: Draft<InS>, action: IAction<ID>) => Draft<InS> | any;
    constructor(initialState: InS, op?: Partial<IFluentReducerOption<InS>>);
    protected _caseWithAction<P>(type: string, handler: IHandler<InS, IAction<ID, P>>): (payload: P) => IAction<ID, P>;
    getState(): Readonly<InS>;
    protected _dispatch(action: IAction<ID>): void;
    dispatch(action: IAction<ID>): void;
    dispatch<R = any>(action: AsyncActionCreator<ID, InS, any, R, any>): Promise<R>;
    reducer: (state: InS, action: IAction<ID>) => Readonly<InS>;
    sync<P = void>(type: string, handler: IHandler<InS, P>): IActionCreator<ID, P>;
    async<Param = void, Result = void, Err = Error>(type: string, handler: IAsyncHandler<ID, InS, Param, Result>, handlers?: Partial<IAsyncHandlers<InS, Param, Result, Err>>): (param: Param) => AsyncActionCreator<ID, InS, Param, Result, Err>;
    subscribe(listener: ListenerFunction<ID, InS>): void;
    unsubscribe(listener: ListenerFunction<ID, InS>): void;
    unsubsribeAll(): void;
}
