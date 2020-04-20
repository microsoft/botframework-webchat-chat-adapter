import { AdapterConfig, AdapterEnhancer, IngressFunction } from './types/AdapterTypes';

import createApplyMiddleware, { Middleware } from './internals/createApplyMiddleware';

type IngressMiddleware<TActivity, TAdapterConfig extends AdapterConfig> = Middleware<TActivity, TAdapterConfig, IngressFunction<TActivity>>;

export default function applyIngressMiddleware<TActivity, TAdapterConfig extends AdapterConfig>(
  ...middlewares: IngressMiddleware<TActivity, TAdapterConfig>[]
): AdapterEnhancer<TActivity, TAdapterConfig> {
  return createApplyMiddleware<TActivity, TAdapterConfig, IngressFunction<TActivity>>(
    api => api.ingress,
    (api, fn) => ({ ...api, ingress: fn })
  )(...middlewares);
}

export type { IngressMiddleware };
