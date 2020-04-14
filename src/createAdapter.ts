import createDeferred, { DeferredPromise } from 'p-defer';
import EventTarget from 'event-target-shim-es5';

import { Adapter, AdapterOptions, AdapterEnhancer } from './types/AdapterTypes';
import promiseRaceMap from './utils/promiseRaceMap';
import rejectOnAbort from './utils/rejectOnAbort';

const DEFAULT_ENHANCER: AdapterEnhancer<any> = next => options => next(options);

export default function createAdapter<TActivity>(
  options: AdapterOptions = {},
  enhancer: AdapterEnhancer<TActivity> = DEFAULT_ENHANCER
): Adapter<TActivity> {
  let ingressQueue: TActivity[] = [];
  let nextIterateDeferred: DeferredPromise<void>;
  const closeDeferred = createDeferred();
  const eventTarget = new EventTarget();

  return enhancer((options: AdapterOptions) => ({
    activities: ({ signal } = {}) => {
      const aborted = rejectOnAbort(signal);

      return {
        async *[Symbol.asyncIterator]() {
          for (;;) {
            if (!ingressQueue.length) {
              const result = await promiseRaceMap({
                abort: aborted,
                end: closeDeferred.promise,
                next: (nextIterateDeferred || (nextIterateDeferred = createDeferred())).promise
              });

              if ('abort' in result) {
                throw new Error('aborted');
              } else if ('end' in result) {
                break;
              }

              nextIterateDeferred = null;
            }

            yield ingressQueue.shift();
          }
        }
      };
    },

    addEventListener: eventTarget.addEventListener.bind(eventTarget),
    removeEventListener: eventTarget.removeEventListener.bind(eventTarget),

    close: () => {
      closeDeferred.resolve();
    },

    dispatchEvent: eventTarget.dispatchEvent.bind(eventTarget),

    egress: (): Promise<void> => {
      return Promise.reject(new Error('There are no enhancers registered for egress().'));
    },

    ingress: activity => {
      ingressQueue.push(activity);
      nextIterateDeferred && nextIterateDeferred.resolve();
    }
  }))(options);
}
