// We should use "readyState" instead
enum ReadyState {
  // Uninitialized = 0,
  // Connecting = 1,
  // Connected = 2

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

interface Adapter<TActivity> extends MiddlewareAPI<TActivity>, EventTarget {
  activities: (options?: IterateActivitiesOptions) => AsyncIterable<TActivity>;
  addEventListener: (name: string, listener: EventListener) => void;
  close: () => void;
  dispatchEvent: (event: Event) => boolean;
  readyState: ReadyState;
  removeEventListener: (name: string, listener: EventListener) => void;
}

interface MiddlewareAPI<TActivity>
  extends EgressMiddlewareAPI<TActivity>,
    // DispatchEventAdapterAPI,
    IngressMiddlewareAPI<TActivity>,
    SetReadyStateMiddlewareAPI {}

type EgressFunction<TActivity> = (activity: TActivity, options?: EgressOptions<TActivity>) => Promise<void>;

interface EgressMiddlewareAPI<TActivity> {
  egress: EgressFunction<TActivity>;
}

// type DispatchEventFunction = (event: Event) => boolean;

// interface DispatchEventAdapterAPI {
//   dispatchEvent: DispatchEventFunction;
// }

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
  // DispatchEventAdapterAPI,
  // DispatchEventFunction,
  IngressMiddlewareAPI,
  IngressFunction,
  IterateActivitiesOptions,
  SetReadyStateMiddlewareAPI,
  SetReadyStateFunction
};

// const CLOSED = ReadyState.CLOSED;
// const CONNECTING = ReadyState.CONNECTING;
// const OPEN = ReadyState.OPEN;

export { ReadyState };
