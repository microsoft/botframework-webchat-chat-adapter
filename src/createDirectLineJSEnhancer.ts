import AbortController from 'abort-controller-es5';
import Observable from 'core-js/features/observable';

import { Adapter, AdapterCreator, AdapterEnhancer, AdapterOptions, ConnectionStatus } from './types/AdapterTypes';
import { IDirectLineActivity } from './types/DirectLineTypes';
import shareObservable from './utils/shareObservable';

export interface IDirectLineJS {
  activity$: Observable<IDirectLineActivity>;
  connectionStatus$: Observable<ConnectionStatus>;
  end: () => void;
  postActivity: (activity: IDirectLineActivity) => Observable<string>;
}

export default function createDirectLineJSEnhancer(): AdapterEnhancer<IDirectLineActivity> {
  return (next: AdapterCreator<IDirectLineActivity>) => (
    options: AdapterOptions
  ): Adapter<IDirectLineActivity> & IDirectLineJS => {
    const adapter = next(options);

    return {
      ...adapter,

      activity$: shareObservable(
        new Observable(observer => {
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

          return () => abortController.abort();
        })
      ),

      connectionStatus$: new Observable(observer => {
        const errorListener = () => observer.next(1);
        const openListener = () => observer.next(2);

        adapter.addEventListener('error', errorListener);
        adapter.addEventListener('open', openListener);

        return () => {
          adapter.removeEventListener('error', errorListener);
          adapter.removeEventListener('open', openListener);
        };
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

      end: () => adapter.close()
    };
  };
}
