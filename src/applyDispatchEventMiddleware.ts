import { Adapter, AdapterEnhancer, AdapterOptions, DispatchEventFunction } from './types/AdapterTypes';

import createApplyMiddleware, { Middleware } from './internals/createApplyMiddleware';

type DispatchEventMiddleware<TActivity> = Middleware<TActivity, DispatchEventFunction>;

// This will convert multiple middlewares into a single enhancer.
// Enhancer is another middleware for the constructor of adapter. Essentially HOC for adapter.
// We can chain multiple enhancer together, and plug-in multiple features to a single adapter.
// In the future, if we decided to change Adapter, middleware written by user can still be reused. We won't introduce breaking changes.
export default function applyDispatchEventMiddleware<TActivity>(
  ...middlewares: DispatchEventMiddleware<TActivity>[]
): AdapterEnhancer<TActivity> {
  return createApplyMiddleware<TActivity, DispatchEventFunction>(
    (
      options: AdapterOptions,
      chain: (final: DispatchEventFunction) => DispatchEventFunction,
      adapter: Adapter<TActivity>
    ) => ({
      ...adapter,
      dispatchEvent: (event: Event) => chain(adapter.dispatchEvent)(event)
    })
  )(...middlewares);
}

export type { DispatchEventMiddleware };
