import { Adapter, AdapterState, SealedAdapter } from './types/AdapterTypes';

export default function sealAdapter<TActivity, TAdapterState extends AdapterState>(
  adapter: Adapter<TActivity, TAdapterState>,
  config: TAdapterState
): SealedAdapter<TActivity, TAdapterState> {
  const { getState, setState, getReadyState, setReadyState, ...others } = adapter;
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
