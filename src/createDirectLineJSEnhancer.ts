import AbortController from 'abort-controller-es5';
import Observable from 'core-js/features/observable';

import { Adapter, AdapterCreator, AdapterEnhancer, AdapterOptions, ConnectionStatus } from './types/ChatAdapterTypes';
import { IDirectLineActivity } from './types/DirectLineTypes';
import shareObservable from './utils/shareObservable';

export interface IDirectLineJS<TActivity> {
  activity$: Observable<TActivity>;
  connectionStatus$: Observable<ConnectionStatus>;
  end: () => void;
  postActivity: (activity: TActivity) => Observable<string>;
}

export default function createDirectLineJSEnhancer(): AdapterEnhancer<IDirectLineActivity> {
  return (next: AdapterCreator<IDirectLineActivity>) => (options: AdapterOptions) => {
    let adapter: Adapter<IDirectLineActivity>;

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

      postActivity(activity: IDirectLineActivity) {
        if (!adapter) {
          throw new Error('Before calling postActivity(), you must subscribe to activity$ first.');
        }

        return new Observable(async observer => {
          await adapter.egress(activity, {
            progress: ({ id }) => observer.next(id)
          });

          observer.complete();
        });
      },

      activities: (...args) => {
        if (!adapter) {
          throw new Error('Before calling activities(), you must subscribe to activity$ first.');
        }

        return adapter.activities(...args);
      },

      egress: (...args) => {
        if (!adapter) {
          throw new Error('Before calling egress(), you must subscribe to activity$ first.');
        }

        return adapter.egress(...args);
      },

      end: (...args) => {
        if (!adapter) {
          throw new Error('Before calling end(), you must subscribe to activity$ first.');
        }

        return adapter.end(...args);
      },

      ingress: (...args) => {
        if (!adapter) {
          throw new Error('Before calling ingress(), you must subscribe to activity$ first.');
        }

        return adapter.ingress(...args);
      }
    };
  };
}
