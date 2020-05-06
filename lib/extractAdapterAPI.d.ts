import { Adapter, AdapterState, MiddlewareAPI } from './types/AdapterTypes';
export default function extractAdapterAPI<TActivity, TAdapterState extends AdapterState>(adapter: Adapter<TActivity, TAdapterState>): MiddlewareAPI<TActivity, TAdapterState>;
