import { compose } from 'redux';

import { AdapterAPI, AdapterEnhancer, DispatchEventFunction } from './types/AdapterTypes';
import extractAdapterAPI from './extractAdapterAPI';

type DispatchEventMiddleware<TActivity> = (
  adapterAPI: AdapterAPI<TActivity>
) => (next: DispatchEventFunction) => DispatchEventFunction;

// This will convert multiple middlewares into a single enhancer.
// Enhancer is another middleware for the constructor of adapter. Essentially HOC for adapter.
// We can chain multiple enhancer together, and plug-in multiple features to a single adapter.
// In the future, if we decided to change Adapter, middleware written by user can still be reused. We won't introduce breaking changes.
export default function applyDispatchEventMiddleware<TActivity>(
  ...middlewares: DispatchEventMiddleware<TActivity>[]
): AdapterEnhancer<TActivity> {
  return nextEnhancer => options => {
    const adapter = nextEnhancer(options);
    const api = extractAdapterAPI<TActivity>(adapter);
    const chain = middlewares.map(middleware => middleware(api));
    const dispatchEvent = compose<DispatchEventFunction>(...chain)(api.dispatchEvent);

    return {
      ...adapter,
      dispatchEvent: (event: Event) => dispatchEvent(event)
    };
  };
}

export type { DispatchEventMiddleware };
