import { compose } from 'redux';

import { AdapterAPI, AdapterEnhancer } from './types/ChatAdapterTypes';
import createAdapterAPI from './createAdapterAPI';

type IngressMiddlewareChain<TActivity> = (activity: TActivity) => void;

type IngressMiddleware<TActivity> = (
  adapterAPI: AdapterAPI<TActivity>
) => (next: IngressMiddlewareChain<TActivity>) => IngressMiddlewareChain<TActivity>;

// This will convert multiple middlewares into a single enhancer.
// Enhancer is another middleware for the constructor of adapter. Essentially HOC for adapter.
// We can chain multiple enhancer together, and plug-in multiple features to a single adapter.
// In the future, if we decided to change Adapter, middleware written by user can still be reused. We won't introduce breaking changes.
export default function applyIngressMiddleware<TActivity>(
  ...middlewares: IngressMiddleware<TActivity>[]
): AdapterEnhancer<TActivity> {
  return nextEnhancer => options => {
    const adapter = nextEnhancer(options);
    const api = createAdapterAPI<TActivity>(adapter);
    const chain = middlewares.map(middleware => middleware(api));
    const ingress = compose<IngressMiddlewareChain<TActivity>>(...chain)(api.ingress);

    return {
      ...adapter,
      ingress: (activity: TActivity) => ingress(activity)
    };
  };
}

export type { IngressMiddleware, IngressMiddlewareChain };
