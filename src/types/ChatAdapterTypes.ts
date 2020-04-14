// We should use "readyState" instead
enum ConnectionStatus {
  Uninitialized,
  Connecting,
  Connected
}

type EgressOptions<TActivity> = {
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
  egress: (activity: TActivity, options?: EgressOptions<TActivity>) => Promise<void>;
}

interface IngressAdapterAPI<TActivity> {
  ingress: (activity: TActivity) => void;
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
  EgressOptions,
  EgressAdapterAPI,
  IngressAdapterAPI,
  IterateActivitiesOptions
};
