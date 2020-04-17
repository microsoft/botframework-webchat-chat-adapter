import { Adapter, MiddlewareAPI } from './types/AdapterTypes';

export default function extractAdapterAPI<TActivity>(adapter: Adapter<TActivity>): MiddlewareAPI<TActivity> {
  return {
    close: (...args) => adapter.close(...args),
    egress: (...args) => adapter.egress(...args),
    ingress: (...args) => adapter.ingress(...args),
    getReadyState: (...args) => adapter.getReadyState(...args),
    setReadyState: (...args) => adapter.setReadyState(...args)
  };
}
