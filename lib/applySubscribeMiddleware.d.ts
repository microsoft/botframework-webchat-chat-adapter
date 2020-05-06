import { AdapterState, AdapterEnhancer, SubscribeFunction } from './types/AdapterTypes';
import { Middleware } from './internals/createApplyMiddleware';
declare type SubscribeMiddleware<TActivity, TAdapterState extends AdapterState> = Middleware<TActivity, TAdapterState, SubscribeFunction<TActivity>>;
export default function applySubscribeMiddleware<TActivity, TAdapterState extends AdapterState>(...middlewares: SubscribeMiddleware<TActivity, TAdapterState>[]): AdapterEnhancer<TActivity, TAdapterState>;
export type { SubscribeMiddleware };
