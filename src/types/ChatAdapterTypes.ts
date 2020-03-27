import Observable from 'core-js/features/observable';

import { IActivity } from './DirectLineTypes';

// We should use "readyState" instead
enum ConnectionStatus {
  Uninitialized,
  Connecting,
  Connected
}

interface Adapter {
  activity$: Observable<IActivity>;
  connectionStatus$: Observable<ConnectionStatus>;
  end: () => void;
  postActivity: (activity: IActivity) => Observable<string>;
}

interface AdapterAPI {
  postActivity: (activity: IActivity) => Observable<string>;
}

type AdapterCreator = (options?: AdapterOptions) => Adapter;
type AdapterEnhancer = (next: AdapterCreator) => AdapterCreator;

interface AdapterOptions {
  mockActivity$: Observable<IActivity>;
  mockConnectionStatus$: Observable<IActivity>;
}

export { Adapter, AdapterCreator, AdapterEnhancer, AdapterOptions, AdapterAPI, ConnectionStatus }
