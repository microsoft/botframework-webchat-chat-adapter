/// <reference path="../../src/types/external.d.ts" />
import { Adapter, AdapterState, AdapterCreator, AdapterOptions } from '../types/AdapterTypes';
export default function createLazyEnhancer<TActivity, TAdapterState extends AdapterState>(): (next: AdapterCreator<TActivity, TAdapterState>) => (adapterOptions: AdapterOptions) => Adapter<TActivity, TAdapterState>;
