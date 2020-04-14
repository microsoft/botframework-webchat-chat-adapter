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

type EgressFunction<TActivity> = (activity: TActivity, options?: EgressOptions<TActivity>) => Promise<void>;

interface EgressAdapterAPI<TActivity> {
  egress: EgressFunction<TActivity>;
}

type IngressFunction<TActivity> = (activity: TActivity) => void;

interface IngressAdapterAPI<TActivity> {
  ingress: IngressFunction<TActivity>;
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
  EgressAdapterAPI,
  EgressFunction,
  EgressOptions,
  IngressAdapterAPI,
  IngressFunction,
  IterateActivitiesOptions
};
