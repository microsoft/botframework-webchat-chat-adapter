import { AdapterEnhancer, IngressFunction } from './types/AdapterTypes';

import createApplyMiddleware, { Middleware } from './internals/createApplyMiddleware';

type IngressMiddleware<TActivity> = Middleware<TActivity, IngressFunction<TActivity>>;

export default function applyIngressMiddleware<TActivity>(
  ...middlewares: IngressMiddleware<TActivity>[]
): AdapterEnhancer<TActivity> {
  return createApplyMiddleware<TActivity, IngressFunction<TActivity>>(
    api => api.ingress,
    (api, fn) => ({ ...api, ingress: fn })
  )(...middlewares);
}

export type { IngressMiddleware };
