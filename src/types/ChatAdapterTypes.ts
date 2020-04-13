import Observable from 'core-js/features/observable';

import { IActivity } from './DirectLineTypes';

// We should use "readyState" instead
enum ConnectionStatus {
  Uninitialized,
  Connecting,
  Connected
}

type EgressActivityOptions = {
  progress: (activity: IActivity) => void;
};

type IterateActivitiesOptions = {
  signal?: AbortSignal;
};

interface Adapter extends AdapterAPI {
  activities: (options?: IterateActivitiesOptions) => AsyncIterable<IActivity>;
  end: () => void;
}

interface AdapterAPI extends EgressAdapterAPI, IngressAdapterAPI {}

interface EgressAdapterAPI {
  egressActivity: (activity: IActivity, options: EgressActivityOptions) => Promise<void>;
}

interface IngressAdapterAPI {
  ingressActivity: (activity: IActivity) => void;
}

type AdapterCreator = (options?: AdapterOptions) => Adapter;
type AdapterEnhancer = (next: AdapterCreator) => AdapterCreator;

interface AdapterOptions {
  mockActivity$?: Observable<IActivity>;
  mockConnectionStatus$?: Observable<IActivity>;
}

export type {
  Adapter,
  AdapterAPI,
  AdapterCreator,
  AdapterEnhancer,
  AdapterOptions,
  ConnectionStatus,
  EgressActivityOptions,
  EgressAdapterAPI,
  IngressAdapterAPI,
  IterateActivitiesOptions
};
