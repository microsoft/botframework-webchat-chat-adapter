// We should use "readyState" instead
enum ConnectionStatus {
  Uninitialized,
  Connecting,
  Connected
}

type EgressActivityOptions<TActivity> = {
  progress: (activity: TActivity) => void;
};

type IterateActivitiesOptions = {
  signal?: AbortSignal;
};

interface Adapter<TActivity> extends AdapterAPI<TActivity> {
  activities: (options?: IterateActivitiesOptions) => AsyncIterable<TActivity>;
  end: () => void;
}

interface AdapterAPI<TActivity> extends EgressAdapterAPI<TActivity>, IngressAdapterAPI<TActivity> {}

interface EgressAdapterAPI<TActivity> {
  egressActivity: (activity: TActivity, options?: EgressActivityOptions<TActivity>) => Promise<void>;
}

interface IngressAdapterAPI<TActivity> {
  ingressActivity: (activity: TActivity) => void;
}

type AdapterCreator<TActivity> = (options?: AdapterOptions) => Adapter<TActivity>;
type AdapterEnhancer<TActivity> = (next: AdapterCreator<TActivity>) => AdapterCreator<TActivity>;

interface AdapterOptions {}

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
