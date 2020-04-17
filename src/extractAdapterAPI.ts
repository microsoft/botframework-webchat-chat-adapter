import { Adapter, MiddlewareAPI } from './types/AdapterTypes';

export default function extractAdapterAPI<TActivity>(adapter: Adapter<TActivity>): MiddlewareAPI<TActivity> {
  return {
    close: adapter.close.bind(adapter),
    egress: adapter.egress.bind(adapter),
    ingress: adapter.ingress.bind(adapter),
    getReadyState: adapter.getReadyState.bind(adapter),
    setReadyState: adapter.setReadyState.bind(adapter)
  };
}
