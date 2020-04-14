import { compose } from 'redux';

import { AdapterAPI, AdapterEnhancer } from './types/ChatAdapterTypes';

type IngressActivityUpdater<TActivity> = (activity: TActivity) => void;

type IngressActivityMiddleware<TActivity> = (
  adapterAPI: AdapterAPI<TActivity>
) => (next: IngressActivityUpdater<TActivity>) => IngressActivityUpdater<TActivity>;

// This will convert multiple middlewares into a single enhancer.
// Enhancer is another middleware for the constructor of adapter. Essentially HOC for adapter.
// We can chain multiple enhancer together, and plug-in multiple features to a single adapter.
// In the future, if we decided to change Adapter, middleware written by user can still be reused. We won't introduce breaking changes.
export default function applyIngressActivityMiddleware<TActivity>(
  ...middlewares: IngressActivityMiddleware<TActivity>[]
): AdapterEnhancer<TActivity> {
  return nextEnhancer => options => {
    const adapter = nextEnhancer(options);
    const chain = middlewares.map(middleware =>
      middleware({
        egressActivity: adapter.egressActivity,
        ingressActivity: adapter.ingressActivity
      })
    );
    const ingressActivity = compose<IngressActivityUpdater<TActivity>>(...chain)(adapter.ingressActivity.bind(adapter));

    return {
      ...adapter,
      ingressActivity: (activity: TActivity) => ingressActivity(activity)
    };
  };
}

export type { IngressActivityMiddleware, IngressActivityUpdater };
