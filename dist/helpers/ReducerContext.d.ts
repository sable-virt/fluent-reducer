import React from 'react';
import { FluentReducer } from '../FluentReducer';
import { ReducerResponse } from '../UseFluentReducer';
export declare const createReducerContext: <InS>(reducer: FluentReducer<InS>) => [React.FC<{}>, () => ReducerResponse<InS>];
