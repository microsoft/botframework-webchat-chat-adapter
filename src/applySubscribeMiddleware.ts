import { AdapterState, AdapterEnhancer, SubscribeFunction } from './types/AdapterTypes';

import createApplyMiddleware, { Middleware } from './internals/createApplyMiddleware';

type SubscribeMiddleware<TActivity, TAdapterState extends AdapterState> = Middleware<
  TActivity,
  TAdapterState,
  SubscribeFunction<TActivity>
>;

export default function applySubscribeMiddleware<TActivity, TAdapterState extends AdapterState>(
  ...middlewares: SubscribeMiddleware<TActivity, TAdapterState>[]
): AdapterEnhancer<TActivity, TAdapterState> {
  return createApplyMiddleware<TActivity, TAdapterState, SubscribeFunction<TActivity>>(
    api => api.subscribe,
    (api, fn) => ({ ...api, subscribe: fn })
  )(...middlewares);
}

export type { SubscribeMiddleware };
