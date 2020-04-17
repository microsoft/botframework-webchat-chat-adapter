/// <reference path="./types/external.d.ts" />

import EventTarget from 'event-target-shim-es5';

import { Adapter, AdapterOptions, AdapterEnhancer, ReadyState, SealedAdapter } from './types/AdapterTypes';
import createAsyncIterableQueue, { AsyncIterableQueue } from './utils/createAsyncIterableQueue';
import createEvent from './utils/createEvent';
import sealAdapter from './sealAdapter';

const DEFAULT_ENHANCER: AdapterEnhancer<any> = next => options => next(options);

export default function createAdapter<TActivity>(
  options: AdapterOptions = {},
  enhancer: AdapterEnhancer<TActivity> = DEFAULT_ENHANCER
): SealedAdapter<TActivity> {
  const adapter = enhancer((options: AdapterOptions) => {
    const eventTarget = new EventTarget();
    let ingressQueues: AsyncIterableQueue<TActivity>[] = [];
    let readyStatePropertyValue = ReadyState.CONNECTING;

    const adapter: Adapter<TActivity> = {
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
        ingressQueues.forEach(ingressQueue => ingressQueue.end());
        ingressQueues.splice(0, Infinity);
      },

      // Egress middleware API
      egress: (): Promise<void> => {
        return Promise.reject(new Error('There are no enhancers registered for egress().'));
      },

      // Ingress middleware API
      ingress: activity => {
        ingressQueues.forEach(ingressQueue => ingressQueue.push(activity));
      },

      getReadyState: () => readyStatePropertyValue,

      setReadyState: (readyState: ReadyState) => {
        if (readyState === readyStatePropertyValue) {
          return;
        }

        if (readyStatePropertyValue === ReadyState.CLOSED) {
          throw new Error('Cannot change "readyState" after it is CLOSED.');
        } else if (
          readyState !== ReadyState.CLOSED &&
          readyState !== ReadyState.CONNECTING &&
          readyState !== ReadyState.OPEN
        ) {
          throw new Error('"readyState" must be either CLOSED, CONNECTING or OPEN.');
        }

        readyStatePropertyValue = readyState;
        eventTarget.dispatchEvent(createEvent(readyState === ReadyState.OPEN ? 'open' : 'error'));
      }
    };

    return adapter;
  })(options);

  if (Object.getPrototypeOf(adapter) !== Object.prototype) {
    throw new Error('Object returned from enhancer must not be a class object.');
  }

  return sealAdapter(adapter);
}
