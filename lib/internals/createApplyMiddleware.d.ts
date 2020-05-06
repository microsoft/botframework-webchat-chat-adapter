import { AdapterState, AdapterEnhancer, MiddlewareAPI } from '../types/AdapterTypes';
declare type Middleware<TActivity, TAdapterState extends AdapterState, TFunction> = (adapterAPI: MiddlewareAPI<TActivity, TAdapterState>) => (next: TFunction) => TFunction | void;
export default function createApplyMiddleware<TActivity, TAdapterState extends AdapterState, TFunction>(getFunction: (api: MiddlewareAPI<TActivity, TAdapterState>) => TFunction, setFunction: (api: MiddlewareAPI<TActivity, TAdapterState>, fn: TFunction) => MiddlewareAPI<TActivity, TAdapterState>): (...middlewares: Middleware<TActivity, TAdapterState, TFunction>[]) => AdapterEnhancer<TActivity, TAdapterState>;
export type { Middleware };
