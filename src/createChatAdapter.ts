import createDeferred, { DeferredPromise } from 'p-defer';

import { Adapter, AdapterOptions, AdapterEnhancer, EgressActivityOptions } from './types/ChatAdapterTypes';
import promiseRaceMap from './utils/promiseRaceMap';
import rejectOnAbort from './utils/rejectOnAbort';

const DEFAULT_ENHANCER: AdapterEnhancer<any> = next => options => next(options);

export default function createChatAdapter<TActivity>(
  options: AdapterOptions = {},
  enhancer: AdapterEnhancer<TActivity> = DEFAULT_ENHANCER
): Adapter<TActivity> {
  let ingressQueue: TActivity[] = [];
  let nextIterateDeferred: DeferredPromise<void>;
  const endDeferred = createDeferred();

  return enhancer((options: AdapterOptions) => ({
    // TODO: Implement this adapter using IC3SDK.
    //       Don't implement using RxJS@5 because it's obsoleted. Implement using ES Observable from core-js.
    //       Also, don't use any operators from RxJS package. It make the logic unreadable and very difficult to debug.

    activities: ({ signal } = {}) => {
      const aborted = rejectOnAbort(signal);

      return {
        async *[Symbol.asyncIterator]() {
          for (;;) {
            if (!ingressQueue.length) {
              const result = await promiseRaceMap({
                abort: aborted,
                end: endDeferred.promise,
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

    egressActivity: (activity: TActivity, options: EgressActivityOptions): Promise<void> => {
      throw new Error('not implemented');
    },

    end: () => {
      endDeferred.resolve();
    },

    ingressActivity: activity => {
      ingressQueue.push(activity);
      nextIterateDeferred && nextIterateDeferred.resolve();
    }
  }))(options);
}
