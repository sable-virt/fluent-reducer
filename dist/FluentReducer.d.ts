import { AsyncActionCreator, IAction, IActionCreator, IAsyncHandler, IAsyncHandlers } from './AsyncActionCreator';
export declare type IHandler<InS, P> = (state: InS, payload: P) => void;
export interface IFluentReducerOption<InS> {
    defaultHandler: IHandler<InS, IAction<any>> | undefined;
    middlewares: ((state: Readonly<InS>) => void)[];
    prefix: string;
    verbose: boolean;
}
export declare class FluentReducer<ID extends string, InS> {
    initialState: InS;
    protected _option: IFluentReducerOption<InS>;
    protected _state: InS;
    protected _handle: {
        [actionType: string]: IHandler<InS, any>;
    };
    protected _exec: (state: InS, action: IAction<ID>) => InS | any;
    constructor(initialState: InS, op?: Partial<IFluentReducerOption<InS>>);
    protected _caseWithAction<P>(type: string, handler: IHandler<InS, IAction<ID, P>>): (payload: P) => IAction<ID, P>;
    getState(): Readonly<InS>;
    reducer: (state: InS, action: IAction<ID>) => Readonly<InS>;
    sync<P = void>(type: string, handler: IHandler<InS, P>): IActionCreator<ID, P>;
    async<Param = void, Result = void, Err = Error>(type: string, handler: IAsyncHandler<ID, InS, Param, Result>, handlers?: Partial<IAsyncHandlers<InS, Param, Result, Err>>): (param: Param) => AsyncActionCreator<ID, InS, Param, Result, Err>;
}
