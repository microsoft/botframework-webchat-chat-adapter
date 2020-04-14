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

interface Adapter<TActivity> extends AdapterAPI<TActivity>, EventTarget {
  activities: (options?: IterateActivitiesOptions) => AsyncIterable<TActivity>;
  addEventListener: (name: string, listener: EventListener) => void;
  close: () => void;
  removeEventListener: (name: string, listener: EventListener) => void;
}

interface AdapterAPI<TActivity> extends EgressAdapterAPI<TActivity>, DispatchEventAdapterAPI, IngressAdapterAPI<TActivity> {}

type EgressFunction<TActivity> = (activity: TActivity, options?: EgressOptions<TActivity>) => Promise<void>;

interface EgressAdapterAPI<TActivity> {
  egress: EgressFunction<TActivity>;
}

type DispatchEventFunction = (event: Event) => boolean;

interface DispatchEventAdapterAPI {
  dispatchEvent: DispatchEventFunction;
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
  DispatchEventAdapterAPI,
  DispatchEventFunction,
  IngressAdapterAPI,
  IngressFunction,
  IterateActivitiesOptions
};
