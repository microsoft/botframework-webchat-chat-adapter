import { AdapterState, AdapterEnhancer, EgressFunction } from './types/AdapterTypes';
import { Middleware } from './internals/createApplyMiddleware';
declare type EgressMiddleware<TActivity, TAdapterState extends AdapterState> = Middleware<TActivity, TAdapterState, EgressFunction<TActivity>>;
export default function applyEgressMiddleware<TActivity, TAdapterState extends AdapterState>(...middlewares: EgressMiddleware<TActivity, TAdapterState>[]): AdapterEnhancer<TActivity, TAdapterState>;
export type { EgressMiddleware };
