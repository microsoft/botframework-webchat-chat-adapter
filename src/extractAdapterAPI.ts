import { Adapter, AdapterAPI } from './types/AdapterTypes';

export default function extractAdapterAPI<TActivity>(adapter: Adapter<TActivity>): AdapterAPI<TActivity> {
  return {
    dispatchEvent: adapter.dispatchEvent.bind(adapter),
    egress: adapter.egress.bind(adapter),
    ingress: adapter.ingress.bind(adapter)
  };
}
