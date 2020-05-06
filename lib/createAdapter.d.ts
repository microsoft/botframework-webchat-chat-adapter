/// <reference path="../src/types/external.d.ts" />
import { AdapterState, AdapterOptions, AdapterEnhancer, SealedAdapter } from './types/AdapterTypes';
export default function createAdapter<TActivity, TAdapterState extends AdapterState>(options?: AdapterOptions, enhancer?: AdapterEnhancer<TActivity, TAdapterState>): SealedAdapter<TActivity, TAdapterState>;
