import { AdapterState, AdapterEnhancer, EgressFunction } from './types/AdapterTypes';

import createApplyMiddleware, { Middleware } from './internals/createApplyMiddleware';

type EgressMiddleware<TActivity, TAdapterState extends AdapterState> = Middleware<TActivity, TAdapterState, EgressFunction<TActivity>>;

export default function applyEgressMiddleware<TActivity, TAdapterState extends AdapterState>(
  ...middlewares: EgressMiddleware<TActivity, TAdapterState>[]
): AdapterEnhancer<TActivity, TAdapterState> {
  return createApplyMiddleware<TActivity, TAdapterState, EgressFunction<TActivity>>(
    api => api.egress,
    (api, fn) => ({ ...api, egress: fn })
  )(...middlewares);
}

export type { EgressMiddleware };
