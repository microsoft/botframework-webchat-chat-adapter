/// <reference path="./types/external.d.ts" />

import {
  Adapter,
  AdapterEnhancer,
  AdapterOptions,
  AdapterState,
  ReadyState,
  SealedAdapter
} from './types/AdapterTypes';
import Observable, { Subscription } from 'core-js/features/observable';
import createAsyncIterableQueue, { AsyncIterableQueue } from './utils/createAsyncIterableQueue';

import EventTarget from 'event-target-shim-es5';
import { TelemetryEvents } from './types/ic3/TelemetryEvents';
import createEvent from './utils/createEvent';
import sealAdapter from './sealAdapter';
import uniqueId from './ic3/utils/uniqueId';

const DEFAULT_ENHANCER: AdapterEnhancer<any, any> = next => options => next(options);

export default function createAdapter<TActivity, TAdapterState extends AdapterState>(
  options: AdapterOptions = {},
  enhancer: AdapterEnhancer<TActivity, TAdapterState> = DEFAULT_ENHANCER,
  logger?: any
): SealedAdapter<TActivity, TAdapterState> {
  let mutableAdapterState: TAdapterState = {} as TAdapterState;
  let sealed: boolean;
  let activeSubscription: Subscription;
  logger?.logClientSdkTelemetryEvent(Microsoft.CRM.Omnichannel.IC3Client.Model.LogLevel.DEBUG,
    {
      Event: TelemetryEvents.CREATE_ADAPTER_EVENT,
      Description: `Adapter: start init adapter`,
    }
  );
  const adapter = enhancer(
    (): Adapter<TActivity, TAdapterState> => {
      const eventTarget = new EventTarget();
      let ingressQueues: AsyncIterableQueue<TActivity>[] = [];
      let readyStatePropertyValue = ReadyState.CONNECTING;

      return {
        id: uniqueId().toString(),
        addEventListener: eventTarget.addEventListener.bind(eventTarget),
        dispatchEvent: eventTarget.dispatchEvent.bind(eventTarget),
        removeEventListener: eventTarget.removeEventListener.bind(eventTarget),

        activities: ({ signal } = {}): AsyncIterable<TActivity> => {
          const queue = createAsyncIterableQueue<TActivity>({ signal });

          ingressQueues.push(queue);

          signal &&
            signal.addEventListener('abort', () => {
              const index = ingressQueues.indexOf(queue);

              ~index || ingressQueues.splice(index, 1);
            });

          return queue.iterable;
        },

        close: () => {
          logger?.logClientSdkTelemetryEvent(Microsoft.CRM.Omnichannel.IC3Client.Model.LogLevel.DEBUG,
            {
              Event: TelemetryEvents.CREATE_ADAPTER_EVENT,
              Description: `Adapter: adapter closed`,
            }
          );
          ingressQueues.forEach(ingressQueue => ingressQueue.end());
          ingressQueues.splice(0, Infinity);

          activeSubscription && activeSubscription.unsubscribe();
          activeSubscription = null;
        },

        // Egress middleware API
        egress: (): Promise<void> => {
          logger?.logClientSdkTelemetryEvent(Microsoft.CRM.Omnichannel.IC3Client.Model.LogLevel.ERROR,
            {
              Event: TelemetryEvents.CREATE_ADAPTER_EVENT,
              Description: `Adapter: There are no enhancers registered for egress().`,
            }
          );
          return Promise.reject(new Error('There are no enhancers registered for egress().'));
        },

        getState: (name: keyof TAdapterState) => {
          return mutableAdapterState[name];
        },

        getReadyState: () => readyStatePropertyValue,

        // Ingress middleware API
        ingress: activity => {
          ingressQueues.forEach(ingressQueue => ingressQueue.push(activity));
        },

        setState: (name: keyof TAdapterState, value: any) => {
          if (sealed && !(name in mutableAdapterState)) {
            logger?.logClientSdkTelemetryEvent(Microsoft.CRM.Omnichannel.IC3Client.Model.LogLevel.ERROR,
              {
                Event: TelemetryEvents.CREATE_ADAPTER_EVENT,
                Description: `Adapter: Cannot set config "${name}" because it was not set before being sealed.`,
              }
            );
            throw new Error(`Cannot set config "${name}" because it was not set before being sealed.`);
          }

          // TODO: Fix this typing
          // mutableAdapterState[name] = value;
          (mutableAdapterState as any)[name] = value;
        },

        setReadyState: (readyState: ReadyState) => {
          if (readyState === readyStatePropertyValue) {
            return;
          }

          if (readyStatePropertyValue === ReadyState.CLOSED) {
            logger?.logClientSdkTelemetryEvent(Microsoft.CRM.Omnichannel.IC3Client.Model.LogLevel.ERROR,
              {
                Event: TelemetryEvents.CREATE_ADAPTER_EVENT,
                Description: `Adapter: Cannot change "readyState" after it is CLOSED.`,
              }
            );
            throw new Error('Cannot change "readyState" after it is CLOSED.');
          } else if (
            readyState !== ReadyState.CLOSED &&
            readyState !== ReadyState.CONNECTING &&
            readyState !== ReadyState.OPEN
          ) {
            logger?.logClientSdkTelemetryEvent(Microsoft.CRM.Omnichannel.IC3Client.Model.LogLevel.ERROR,
              {
                Event: TelemetryEvents.CREATE_ADAPTER_EVENT,
                Description: `"readyState" must be either CLOSED, CONNECTING or OPEN.`,
                CustomProperties: {
                  "ReadyState": readyState
                }
              }
            );
            throw new Error('"readyState" must be either CLOSED, CONNECTING or OPEN.');
          }

          readyStatePropertyValue = readyState;

          if (readyState === ReadyState.CLOSED) {
            activeSubscription && activeSubscription.unsubscribe();
            activeSubscription = null;
          }
          let event = readyState === ReadyState.OPEN ? 'open' : 'error';
          eventTarget.dispatchEvent(createEvent(event));
          logger?.logClientSdkTelemetryEvent(Microsoft.CRM.Omnichannel.IC3Client.Model.LogLevel.DEBUG,
            {
              Event: TelemetryEvents.CREATE_ADAPTER_EVENT,
              Description: `Adapter: dispatching event: ${event}`,
            }
          );
        },

        subscribe: (observable: Observable<TActivity> | false) => {
          activeSubscription && activeSubscription.unsubscribe();
          activeSubscription = null;
          if (!observable) {
            logger?.logClientSdkTelemetryEvent(Microsoft.CRM.Omnichannel.IC3Client.Model.LogLevel.WARN,
              {
                Event: TelemetryEvents.CREATE_ADAPTER_EVENT,
                Description: `Adapter:observable is still null, returning.`,
              }
            );
            return;
          }
          logger?.logClientSdkTelemetryEvent(Microsoft.CRM.Omnichannel.IC3Client.Model.LogLevel.DEBUG,
            {
              Event: TelemetryEvents.CREATE_ADAPTER_EVENT,
              Description: `Adapter: start subscribing.`,
            }
          );

          let subscription: Subscription;
          let subscribee = {
            start(thisSubscription: Subscription) {
              activeSubscription = thisSubscription;
              subscription = thisSubscription;
            },

            complete() {
              if (activeSubscription === subscription) {
                activeSubscription = null;
              }
            },

            error(error: Error) {
              if (activeSubscription === subscription) {
                activeSubscription = null;
              }

              // TODO: Propagate the error to fail the adapter.
              // ingressQueues.forEach(ingressQueue => ingressQueue.push(error));
            },

            next(value: TActivity) {
              adapter.ingress(value);
            },
          };
          observable.subscribe(subscribee);
        }
      };
    }
  )(options);
  if (Object.getPrototypeOf(adapter) !== Object.prototype) {
    logger?.logClientSdkTelemetryEvent(Microsoft.CRM.Omnichannel.IC3Client.Model.LogLevel.ERROR,
      {
        Event: TelemetryEvents.CREATE_ADAPTER_EVENT,
        Description: `Object returned from enhancer must not be a class object.`,
      }
    );
    throw new Error('Object returned from enhancer must not be a class object.');
  }

  const sealedAdapter = sealAdapter(adapter, mutableAdapterState);

  sealed = true;
  return sealedAdapter;
}
