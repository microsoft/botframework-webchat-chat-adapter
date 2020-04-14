import { Adapter, AdapterAPI } from './types/ChatAdapterTypes';

export default function createAdapterAPI<TActivity>(adapter: Adapter<TActivity>): AdapterAPI<TActivity> {
  return {
    egress: adapter.egress.bind(adapter),
    ingress: adapter.ingress.bind(adapter)
  };
}
