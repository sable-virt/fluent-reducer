import { AsyncActionCreator, IAction, IActionCreator, IAsyncHandler, IAsyncHandlers } from './AsyncActionCreator';
export declare type IHandler<InS, P> = (state: InS, payload: P) => void;
export interface IFluentReducerOption<InS> {
    defaultHandler: IHandler<InS, IAction> | undefined;
    verbose: boolean;
}
export declare class FluentReducer<InS> {
    private _handle;
    private _exec;
    private _option;
    constructor(op?: Partial<IFluentReducerOption<InS>>);
    reducer: (state: InS, action: any) => any;
    private _caseWithAction;
    sync<P = any>(type: string, handler: IHandler<InS, P>): IActionCreator<P>;
    async<Param, Result, Err>(type: string, handler: IAsyncHandler<InS, Param, Result>, handlers?: Partial<IAsyncHandlers<InS, Param, Result, Err>>): (param: Param) => AsyncActionCreator<InS, Param, Result, Err>;
}
