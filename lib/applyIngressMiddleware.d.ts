import { AdapterState, AdapterEnhancer, IngressFunction } from './types/AdapterTypes';
import { Middleware } from './internals/createApplyMiddleware';
declare type IngressMiddleware<TActivity, TAdapterState extends AdapterState> = Middleware<TActivity, TAdapterState, IngressFunction<TActivity>>;
export default function applyIngressMiddleware<TActivity, TAdapterState extends AdapterState>(...middlewares: IngressMiddleware<TActivity, TAdapterState>[]): AdapterEnhancer<TActivity, TAdapterState>;
export type { IngressMiddleware };
