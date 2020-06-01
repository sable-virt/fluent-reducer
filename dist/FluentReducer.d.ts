import { AsyncActionCreator, IAction, IActionCreator, IAsyncHandler, IAsyncHandlers } from './AsyncActionCreator';
export declare type IHandler<InS, P> = (state: InS, payload: P) => void;
export interface IFluentReducerOption<InS> {
    defaultHandler: IHandler<InS, IAction> | undefined;
    middlewares: ((state: Readonly<InS>) => void)[];
    prefix: string;
    verbose: boolean;
}
export declare class FluentReducer<InS> {
    initialState: InS;
    private _handle;
    private _exec;
    private _option;
    constructor(initialState: InS, op?: Partial<IFluentReducerOption<InS>>);
    reducer: (state: InS, action: IAction) => Readonly<InS>;
    private _caseWithAction;
    sync<P = void>(type: string, handler: IHandler<InS, P>): IActionCreator<P>;
    async<Param = void, Result = void, Err = Error>(type: string, handler: IAsyncHandler<InS, Param, Result>, handlers?: Partial<IAsyncHandlers<InS, Param, Result, Err>>): (param: Param) => AsyncActionCreator<InS, Param, Result, Err>;
}
