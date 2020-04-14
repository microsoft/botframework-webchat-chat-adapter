import { compose } from 'redux';

import { AdapterAPI, AdapterEnhancer, EgressFunction, EgressOptions } from './types/ChatAdapterTypes';
import createAdapterAPI from './createAdapterAPI';

type EgressMiddleware<TActivity> = (
  adapterAPI: AdapterAPI<TActivity>
) => (next: EgressFunction<TActivity>) => EgressFunction<TActivity>;

// This will convert multiple middlewares into a single enhancer.
// Enhancer is another middleware for the constructor of adapter. Essentially HOC for adapter.
// We can chain multiple enhancer together, and plug-in multiple features to a single adapter.
// In the future, if we decided to change Adapter, middleware written by user can still be reused. We won't introduce breaking changes.
export default function applyEgressMiddleware<TActivity>(
  ...middlewares: EgressMiddleware<TActivity>[]
): AdapterEnhancer<TActivity> {
  return nextEnhancer => options => {
    const adapter = nextEnhancer(options);
    const api = createAdapterAPI<TActivity>(adapter);
    const chain = middlewares.map(middleware => middleware(api));
    const egress = compose<EgressFunction<TActivity>>(...chain)(api.egress);

    return {
      ...adapter,
      egress: (activity: TActivity, options: EgressOptions<TActivity>) => egress(activity, options)
    };
  };
}

export type { EgressMiddleware };
