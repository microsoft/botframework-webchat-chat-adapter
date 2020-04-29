import { AdapterState, AdapterEnhancer, SetStateFunction } from './types/AdapterTypes';

import createApplyMiddleware, { Middleware } from './internals/createApplyMiddleware';

type SetStateMiddleware<TActivity, TAdapterState extends AdapterState> = Middleware<TActivity, TAdapterState, SetStateFunction<TAdapterState>>;

export default function applySetStateMiddleware<TActivity, TAdapterState extends AdapterState>(
  ...middlewares: SetStateMiddleware<TActivity, TAdapterState>[]
): AdapterEnhancer<TActivity, TAdapterState> {
  return createApplyMiddleware<TActivity, TAdapterState, SetStateFunction<TAdapterState>>(
    api => api.setState,
    (api, fn) => ({ ...api, setState: fn })
  )(...middlewares);
}

export type { SetStateMiddleware };
