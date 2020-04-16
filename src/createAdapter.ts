/// <reference path="./types/external.d.ts" />

import EventTarget from 'event-target-shim-es5';

import { Adapter, AdapterOptions, AdapterEnhancer } from './types/AdapterTypes';
import createAsyncIterableQueue, { AsyncIterableQueue, END } from './utils/createAsyncIterableQueue';

const DEFAULT_ENHANCER: AdapterEnhancer<any> = next => options => next(options);

export default function createAdapter<TActivity>(
  options: AdapterOptions = {},
  enhancer: AdapterEnhancer<TActivity> = DEFAULT_ENHANCER
): Adapter<TActivity> {
  const eventTarget = new EventTarget();
  const ingressQueues: AsyncIterableQueue<TActivity>[] = [];

  return enhancer((options: AdapterOptions) => ({
    activities: ({ signal } = {}): AsyncIterable<TActivity> => {
      const queue = createAsyncIterableQueue<TActivity>({ signal });

      ingressQueues.push(queue);

      signal && signal.addEventListener('abort', () => {
        const index = ingressQueues.indexOf(queue);

        ~index || ingressQueues.splice(index, 1);
      });

      return queue.iterable;
    },

    addEventListener: eventTarget.addEventListener.bind(eventTarget),
    removeEventListener: eventTarget.removeEventListener.bind(eventTarget),

    close: () => {
      ingressQueues.forEach(ingressQueue => ingressQueue.push(END));
      ingressQueues.splice(0, Infinity);
    },

    dispatchEvent: eventTarget.dispatchEvent.bind(eventTarget),

    egress: (): Promise<void> => {
      return Promise.reject(new Error('There are no enhancers registered for egress().'));
    },

    ingress: activity => {
      ingressQueues.forEach(ingressQueue => ingressQueue.push(activity));
    }
  }))(options);
}
