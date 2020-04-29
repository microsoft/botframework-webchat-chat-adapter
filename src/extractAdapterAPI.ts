import { Adapter, AdapterState, MiddlewareAPI } from './types/AdapterTypes';

export default function extractAdapterAPI<TActivity, TAdapterState extends AdapterState>(
  adapter: Adapter<TActivity, TAdapterState>
): MiddlewareAPI<TActivity, TAdapterState> {
  return {
    close: (...args) => adapter.close(...args),
    egress: (...args) => adapter.egress(...args),
    getReadyState: (...args) => adapter.getReadyState(...args),
    getState: (name: keyof TAdapterState) => adapter.getState(name),
    ingress: (...args) => adapter.ingress(...args),
    setReadyState: (...args) => adapter.setReadyState(...args),
    setState: (name: keyof TAdapterState, value: any) => adapter.setState(name, value),
    subscribe: (...args) => adapter.subscribe(...args)
  };
}
