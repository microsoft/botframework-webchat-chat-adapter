import Observable from 'core-js/features/observable';

enum ReadyState {
  CONNECTING = 0,
  OPEN = 1,
  CLOSED = 2
}

type IterateActivitiesOptions = {
  signal?: AbortSignal;
};

type AdapterState = { [key: string]: any };

type SealedAdapter<TActivity, TAdapterState extends AdapterState> = {
  activities: (options?: IterateActivitiesOptions) => AsyncIterable<TActivity>;
  close: () => void;
  egress: EgressFunction<TActivity>;
  ingress: IngressFunction<TActivity>;
  readyState: ReadyState;
  subscribe: SubscribeFunction<TActivity>;
} & EventTarget &
  TAdapterState;

interface Adapter<TActivity, TAdapterState extends AdapterState> extends EventTarget {
  activities: (options?: IterateActivitiesOptions) => AsyncIterable<TActivity>;
  close: () => void;
  egress: EgressFunction<TActivity>;
  getState: GetStateFunction<TAdapterState>;
  getReadyState: () => ReadyState;
  ingress: IngressFunction<TActivity>;
  setReadyState: (readyState: ReadyState) => void;
  setState: SetStateFunction<TAdapterState>;
  subscribe: SubscribeFunction<TActivity>;
  updateChatToken: (token: string, regionGTMS?: any) => void;
}

interface MiddlewareAPI<TActivity, TAdapterState extends AdapterState> {
  close: () => void;
  egress: EgressFunction<TActivity>;
  getReadyState: () => ReadyState;
  getState: GetStateFunction<TAdapterState>;
  ingress: IngressFunction<TActivity>;
  setReadyState: (readyState: ReadyState) => void;
  setState: SetStateFunction<TAdapterState>;
  subscribe: SubscribeFunction<TActivity>;
}

type EgressOptions<TActivity> = {
  progress: (activity: TActivity) => void;
};

type EgressFunction<TActivity> = (activity: TActivity, options?: EgressOptions<TActivity>) => Promise<void> | void;
type GetStateFunction<TAdapterState> = (key: keyof TAdapterState) => any;
type IngressFunction<TActivity> = (activity: TActivity) => void;
type SetStateFunction<TAdapterState> = (key: keyof TAdapterState, value: any) => void;
type SubscribeFunction<TActivity> = (observable: Observable<TActivity> | false) => void;

type AdapterCreator<TActivity, TAdapterState extends AdapterState> = (
  options?: AdapterOptions
) => Adapter<TActivity, TAdapterState>;

type AdapterEnhancer<TActivity, TAdapterState extends AdapterState> = (
  next: AdapterCreator<TActivity, TAdapterState>
) => AdapterCreator<TActivity, TAdapterState>;

interface AdapterOptions {}

export type {
  Adapter,
  AdapterCreator,
  AdapterEnhancer,
  AdapterOptions,
  AdapterState,
  EgressFunction,
  EgressOptions,
  GetStateFunction,
  IngressFunction,
  IterateActivitiesOptions,
  MiddlewareAPI,
  SealedAdapter,
  SetStateFunction,
  SubscribeFunction
};

export { ReadyState };
