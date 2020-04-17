import { Adapter, SealedAdapter } from './types/AdapterTypes';

export default function sealAdapter<TActivity>(adapter: Adapter<TActivity>): SealedAdapter<TActivity> {
  const { getReadyState, setReadyState, ...sealedAdapter } = { ...adapter, readyState: -1 };

  Object.defineProperty(sealedAdapter, 'readyState', {
    get() {
      return getReadyState();
    }
  });

  return Object.seal(sealedAdapter);
}
