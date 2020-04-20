import { Adapter, AdapterConfig, SealedAdapter } from './types/AdapterTypes';

export default function sealAdapter<TActivity, TAdapterConfig extends AdapterConfig>(
  adapter: Adapter<TActivity, TAdapterConfig>,
  config: TAdapterConfig
): SealedAdapter<TActivity, TAdapterConfig> {
  const { getConfig, setConfig, getReadyState, setReadyState, ...others } = adapter;
  const sealedAdapter = { ...others, readyState: -1 };

  for (let key in config) {
    Object.defineProperty(sealedAdapter, key, {
      enumerable: true,
      get() {
        return config[key];
      }
    });
  }

  Object.defineProperty(sealedAdapter, 'readyState', {
    get() {
      return getReadyState();
    }
  });

  return Object.seal(sealedAdapter) as any;
}
