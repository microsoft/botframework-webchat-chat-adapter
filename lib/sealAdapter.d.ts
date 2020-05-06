import { Adapter, AdapterState, SealedAdapter } from './types/AdapterTypes';
export default function sealAdapter<TActivity, TAdapterState extends AdapterState>(adapter: Adapter<TActivity, TAdapterState>, config: TAdapterState): SealedAdapter<TActivity, TAdapterState>;
