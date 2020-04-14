import { Adapter, AdapterEnhancer, AdapterOptions, EgressFunction, EgressOptions } from './types/AdapterTypes';

import createApplyMiddleware, { Middleware } from './internals/createApplyMiddleware';

type EgressMiddleware<TActivity> = Middleware<TActivity, EgressFunction<TActivity>>;

// This will convert multiple middlewares into a single enhancer.
// Enhancer is another middleware for the constructor of adapter. Essentially HOC for adapter.
// We can chain multiple enhancer together, and plug-in multiple features to a single adapter.
// In the future, if we decided to change Adapter, middleware written by user can still be reused. We won't introduce breaking changes.
export default function applyEgressMiddleware<TActivity>(
  ...middlewares: EgressMiddleware<TActivity>[]
): AdapterEnhancer<TActivity> {
  return createApplyMiddleware<TActivity, EgressFunction<TActivity>>(
    (
      options: AdapterOptions,
      chain: (final: EgressFunction<TActivity>) => EgressFunction<TActivity>,
      adapter: Adapter<TActivity>
    ) => ({
      ...adapter,
      egress: (activity: TActivity, options: EgressOptions<TActivity>) => chain(adapter.egress)(activity, options)
    })
  )(...middlewares);
}

export type { EgressMiddleware };
