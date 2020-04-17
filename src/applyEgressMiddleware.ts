import { AdapterEnhancer, EgressFunction } from './types/AdapterTypes';

import createApplyMiddleware, { Middleware } from './internals/createApplyMiddleware';

type EgressMiddleware<TActivity> = Middleware<TActivity, EgressFunction<TActivity>>;

export default function applyEgressMiddleware<TActivity>(
  ...middlewares: EgressMiddleware<TActivity>[]
): AdapterEnhancer<TActivity> {
  return createApplyMiddleware<TActivity, EgressFunction<TActivity>>(
    api => api.egress,
    (api, fn) => ({ ...api, egress: fn })
  )(...middlewares);
}

export type { EgressMiddleware };
