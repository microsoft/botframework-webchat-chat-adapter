enum ReadyState {
  CONNECTING = 0,
  OPEN = 1,
  CLOSED = 2
}

type EgressOptions<TActivity> = {
  progress: (activity: TActivity) => void;
};

type IterateActivitiesOptions = {
  signal?: AbortSignal;
};

interface SealedAdapter<TActivity> extends EventTarget {
  activities: (options?: IterateActivitiesOptions) => AsyncIterable<TActivity>;
  close: () => void;
  egress: EgressFunction<TActivity>;
  ingress: IngressFunction<TActivity>;
  readyState: ReadyState;
}

interface Adapter<TActivity> extends EventTarget {
  activities: (options?: IterateActivitiesOptions) => AsyncIterable<TActivity>;
  close: () => void;
  egress: EgressFunction<TActivity>;
  ingress: IngressFunction<TActivity>;
  getReadyState: () => ReadyState;
  setReadyState: (readyState: ReadyState) => void;
}

interface MiddlewareAPI<TActivity> {
  close: () => void;
  egress: EgressFunction<TActivity>;
  ingress: IngressFunction<TActivity>;
  getReadyState: () => ReadyState;
  setReadyState: (readyState: ReadyState) => void;
}

type EgressFunction<TActivity> = (activity: TActivity, options?: EgressOptions<TActivity>) => Promise<void>;
type IngressFunction<TActivity> = (activity: TActivity) => void;

type AdapterCreator<TActivity> = (options?: AdapterOptions) => Adapter<TActivity>;
type AdapterEnhancer<TActivity> = (next: AdapterCreator<TActivity>) => AdapterCreator<TActivity>;

interface AdapterOptions {}

export type {
  Adapter,
  AdapterCreator,
  AdapterEnhancer,
  AdapterOptions,
  EgressFunction,
  EgressOptions,
  IngressFunction,
  IterateActivitiesOptions,
  MiddlewareAPI,
  SealedAdapter
};

export { ReadyState };
