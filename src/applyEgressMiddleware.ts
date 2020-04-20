import { AdapterConfig, AdapterEnhancer, EgressFunction } from './types/AdapterTypes';

import createApplyMiddleware, { Middleware } from './internals/createApplyMiddleware';

type EgressMiddleware<TActivity, TAdapterConfig extends AdapterConfig> = Middleware<TActivity, TAdapterConfig, EgressFunction<TActivity>>;

export default function applyEgressMiddleware<TActivity, TAdapterConfig extends AdapterConfig>(
  ...middlewares: EgressMiddleware<TActivity, TAdapterConfig>[]
): AdapterEnhancer<TActivity, TAdapterConfig> {
  return createApplyMiddleware<TActivity, TAdapterConfig, EgressFunction<TActivity>>(
    api => api.egress,
    (api, fn) => ({ ...api, egress: fn })
  )(...middlewares);
}

export type { EgressMiddleware };
