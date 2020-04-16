import { AdapterEnhancer, EgressMiddlewareAPI, EgressFunction } from './types/AdapterTypes';

import createApplyMiddleware, { Middleware } from './internals/createApplyMiddleware';

type EgressMiddleware<TActivity> = Middleware<TActivity, EgressFunction<TActivity>>;

// This will convert multiple middlewares into a single enhancer.
// Enhancer is another middleware for the constructor of adapter. Essentially HOC for adapter.
// We can chain multiple enhancer together, and plug-in multiple features to a single adapter.
// In the future, if we decided to change Adapter, middleware written by user can still be reused. We won't introduce breaking changes.
export default function applyEgressMiddleware<TActivity>(
  ...middlewares: EgressMiddleware<TActivity>[]
): AdapterEnhancer<TActivity> {
  return createApplyMiddleware<TActivity, EgressMiddlewareAPI<TActivity>, EgressFunction<TActivity>>(
    api => api.egress,
    fn => ({ egress: fn })
  )(...middlewares);
}

export type { EgressMiddleware };
