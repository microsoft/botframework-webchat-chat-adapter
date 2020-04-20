import { Adapter, AdapterConfig, AdapterConfigValue, MiddlewareAPI } from './types/AdapterTypes';

export default function extractAdapterAPI<TActivity, TAdapterConfig extends AdapterConfig>(
  adapter: Adapter<TActivity, TAdapterConfig>
): MiddlewareAPI<TActivity, TAdapterConfig> {
  return {
    close: (...args) => adapter.close(...args),
    egress: (...args) => adapter.egress(...args),
    getConfig: (name: keyof TAdapterConfig) => adapter.getConfig(name),
    getReadyState: (...args) => adapter.getReadyState(...args),
    ingress: (...args) => adapter.ingress(...args),
    setConfig: (name: keyof TAdapterConfig, value: AdapterConfigValue) => adapter.setConfig(name, value),
    setReadyState: (...args) => adapter.setReadyState(...args),
    subscribe: (...args) => adapter.subscribe(...args)
  };
}
