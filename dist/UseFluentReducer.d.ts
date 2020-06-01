import { AsyncActionCreator, IAction } from './AsyncActionCreator';
import { FluentReducer } from './index';
export declare type ReducerResponse<InS> = [Readonly<InS>, DispatchFunction<InS>];
export declare type DispatchFunction<InS> = (action: IAction | AsyncActionCreator<InS, any, any, any>) => Promise<any> | void;
export declare function useFluentReducer<InS>(reducer: FluentReducer<InS>, initializer?: undefined): ReducerResponse<InS>;
