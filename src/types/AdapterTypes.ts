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

interface Adapter<TActivity> extends ExposedMiddlewareAPI<TActivity>, EventTarget {
  activities: (options?: IterateActivitiesOptions) => AsyncIterable<TActivity>;
  addEventListener: (name: string, listener: EventListener) => void;
  close: () => void;
  dispatchEvent: (event: Event) => boolean;
  readyState: ReadyState;
  removeEventListener: (name: string, listener: EventListener) => void;
}

// The ExposeMiddlewareAPI are middleware APIs that are also exposed on the Adapter.
// The MiddlewareAPI include middleware APIs that are not exposed on the Adapter.
// These non-exposed APIs only exists while the middleware is executing and is available only to middleware developers.
interface ExposedMiddlewareAPI<TActivity> extends EgressMiddlewareAPI<TActivity>, IngressMiddlewareAPI<TActivity> {}
interface MiddlewareAPI<TActivity> extends ExposedMiddlewareAPI<TActivity>, SetReadyStateMiddlewareAPI {}

type EgressFunction<TActivity> = (activity: TActivity, options?: EgressOptions<TActivity>) => Promise<void>;

interface EgressMiddlewareAPI<TActivity> {
  egress: EgressFunction<TActivity>;
}

type IngressFunction<TActivity> = (activity: TActivity) => void;

interface IngressMiddlewareAPI<TActivity> {
  ingress: IngressFunction<TActivity>;
}

type SetReadyStateFunction = (readyState: ReadyState) => void;

interface SetReadyStateMiddlewareAPI {
  setReadyState: SetReadyStateFunction;
}

type AdapterCreator<TActivity> = (options?: AdapterOptions) => Adapter<TActivity>;
type AdapterEnhancer<TActivity> = (next: AdapterCreator<TActivity>) => AdapterCreator<TActivity>;

interface AdapterOptions {}

export type {
  Adapter,
  MiddlewareAPI,
  AdapterCreator,
  AdapterEnhancer,
  AdapterOptions,
  EgressMiddlewareAPI,
  EgressFunction,
  EgressOptions,
  IngressMiddlewareAPI,
  IngressFunction,
  IterateActivitiesOptions,
  SetReadyStateMiddlewareAPI,
  SetReadyStateFunction
};

export { ReadyState };
