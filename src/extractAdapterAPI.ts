import { InterimAdapter, MiddlewareAPI } from './types/AdapterTypes';

export default function extractAdapterAPI<TActivity>(adapter: InterimAdapter<TActivity>): MiddlewareAPI<TActivity> {
  return {
    egress: adapter.egress.bind(adapter),
    ingress: adapter.ingress.bind(adapter),
    setReadyState: adapter.setReadyState.bind(adapter)
  };
}
