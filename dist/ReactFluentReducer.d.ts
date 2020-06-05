import { TypeDispatch } from './AsyncActionCreator';
import { FluentReducer, IFluentReducerOption } from './FluentReducer';
export declare class ReactFluentReducer<ID extends string, InS> extends FluentReducer<ID, InS> {
    initialState: InS;
    constructor(initialState: InS, op?: Partial<IFluentReducerOption<InS>>);
    useFluentReducer(): [InS, TypeDispatch<ID, InS>];
}
