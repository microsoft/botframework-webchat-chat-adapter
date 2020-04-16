import {
  AdapterEnhancer,
  SetReadyStateFunction,
  SetReadyStateMiddlewareAPI
} from './types/AdapterTypes';

import createApplyMiddleware, { Middleware } from './internals/createApplyMiddleware';

type SetReadyStateMiddleware<TActivity> = Middleware<TActivity, SetReadyStateFunction>;

// This will convert multiple middlewares into a single enhancer.
// Enhancer is another middleware for the constructor of adapter. Essentially HOC for adapter.
// We can chain multiple enhancer together, and plug-in multiple features to a single adapter.
// In the future, if we decided to change Adapter, middleware written by user can still be reused. We won't introduce breaking changes.
export default function applySetReadyStateMiddleware<TActivity>(
  ...middlewares: SetReadyStateMiddleware<TActivity>[]
): AdapterEnhancer<TActivity> {
  return createApplyMiddleware<TActivity, SetReadyStateMiddlewareAPI, SetReadyStateFunction>(
    api => api.setReadyState,
    fn => ({ setReadyState: fn })
  )(...middlewares);
}

export type { SetReadyStateMiddleware };
