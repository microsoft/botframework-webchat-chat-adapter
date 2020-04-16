import { Adapter, MiddlewareAPI } from './types/AdapterTypes';

export default function extractAdapterAPI<TActivity>(adapter: Adapter<TActivity>): MiddlewareAPI<TActivity> {
  return {
    // dispatchEvent: adapter.dispatchEvent.bind(adapter),
    egress: adapter.egress.bind(adapter),
    ingress: adapter.ingress.bind(adapter),
    setReadyState: adapter.setReadyState.bind(adapter)
  };
}
