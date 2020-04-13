import AbortController from 'abort-controller-es5';
import Observable from 'core-js/features/observable';

import { AdapterCreator, AdapterEnhancer, AdapterOptions, ConnectionStatus } from './types/ChatAdapterTypes';
import { IActivity } from './types/DirectLineTypes';
import shareObservable from './utils/shareObservable';

export interface IDirectLineJS {
  activity$: Observable<IActivity>;
  connectionStatus$: Observable<ConnectionStatus>;
  end: () => void;
  postActivity: (activity: IActivity) => Observable<string>;
}

export default function createDirectLineJSEnhancer(): AdapterEnhancer {
  return (next: AdapterCreator) => (options: AdapterOptions) => {
    let adapter;

    return {
      activity$: shareObservable(
        new Observable(observer => {
          adapter = next(options);

          const abortController = new AbortController();

          (async function () {
            try {
              for await (const activity of adapter.activities({ signal: abortController.signal })) {
                observer.next(activity);
              }

              observer.complete();
            } catch (error) {
              observer.error(error);
            }
          })();

          return () => {
            adapter.end();
            adapter = null;

            abortController.abort();
          };
        })
      ),

      connectionStatus$: new Observable(observer => {
        observer.error('not implemented');

        throw new Error('not implemented');
      }),

      postActivity(activity: IActivity) {
        if (!adapter) {
          throw new Error('Before calling postActivity(), you must subscribe to activity$ first.');
        }

        const { id } = adapter.egressActivity(activity);

        return Observable.from([id]);
      },

      activities: (...args) => {
        if (!adapter) {
          throw new Error('Before calling activities(), you must subscribe to activity$ first.');
        }

        return adapter.activities(...args);
      },

      egressActivity: (...args) => {
        if (!adapter) {
          throw new Error('Before calling egressActivity(), you must subscribe to activity$ first.');
        }

        return adapter.egressActivity(...args);
      },

      end: (...args) => {
        if (!adapter) {
          throw new Error('Before calling end(), you must subscribe to activity$ first.');
        }

        return adapter.end(...args);
      },

      ingressActivity: (...args) => {
        if (!adapter) {
          throw new Error('Before calling ingressActivity(), you must subscribe to activity$ first.');
        }

        return adapter.ingressActivity(...args);
      }
    };
  };
}
