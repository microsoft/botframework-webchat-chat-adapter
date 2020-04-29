import { AdapterConfig, AdapterEnhancer, SetConfigFunction } from './types/AdapterTypes';

import createApplyMiddleware, { Middleware } from './internals/createApplyMiddleware';

type SetConfigMiddleware<TActivity, TAdapterConfig extends AdapterConfig> = Middleware<TActivity, TAdapterConfig, SetConfigFunction<TAdapterConfig>>;

export default function applySetConfigMiddleware<TActivity, TAdapterConfig extends AdapterConfig>(
  ...middlewares: SetConfigMiddleware<TActivity, TAdapterConfig>[]
): AdapterEnhancer<TActivity, TAdapterConfig> {
  return createApplyMiddleware<TActivity, TAdapterConfig, SetConfigFunction<TAdapterConfig>>(
    api => api.setConfig,
    (api, fn) => ({ ...api, setConfig: fn })
  )(...middlewares);
}

export type { SetConfigMiddleware };
