import { compose } from 'redux';

import { IActivity } from './types/DirectLineTypes';
import { AdapterAPI, AdapterEnhancer } from './types/ChatAdapterTypes';

type IngressActivityUpdater = (activity: IActivity) => void;

type IngressActivityMiddleware = (
  adapterAPI: AdapterAPI
) => (next: IngressActivityUpdater) => IngressActivityUpdater;

// This will convert multiple middlewares into a single enhancer.
// Enhancer is another middleware for the constructor of adapter. Essentially HOC for adapter.
// We can chain multiple enhancer together, and plug-in multiple features to a single adapter.
// In the future, if we decided to change Adapter, middleware written by user can still be reused. We won't introduce breaking changes.
export default function applyIngressActivityMiddleware(...middlewares: IngressActivityMiddleware[]): AdapterEnhancer {
  return nextEnhancer => options => {
    const adapter = nextEnhancer(options);
    const chain = middlewares.map(middleware => middleware({ ingressActivity: adapter.ingressActivity }));
    const ingressActivity = compose<IngressActivityUpdater>(...chain)(adapter.ingressActivity.bind(adapter));

    return {
      ...adapter,
      ingressActivity: (activity: IActivity) => ingressActivity(activity)
    };
  };
}

export type { IngressActivityMiddleware, IngressActivityUpdater };
