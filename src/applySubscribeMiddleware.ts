import { AdapterConfig, AdapterEnhancer, SubscribeFunction } from './types/AdapterTypes';

import createApplyMiddleware, { Middleware } from './internals/createApplyMiddleware';

type SubscribeMiddleware<TActivity, TAdapterConfig extends AdapterConfig> = Middleware<
  TActivity,
  TAdapterConfig,
  SubscribeFunction<TActivity>
>;

export default function applySubscribeMiddleware<TActivity, TAdapterConfig extends AdapterConfig>(
  ...middlewares: SubscribeMiddleware<TActivity, TAdapterConfig>[]
): AdapterEnhancer<TActivity, TActivity, TAdapterConfig> {
  return createApplyMiddleware<TActivity, TAdapterConfig, SubscribeFunction<TActivity>>(
    api => api.subscribe,
    (api, fn) => ({ ...api, subscribe: fn })
  )(...middlewares);
}

export type { SubscribeMiddleware };
