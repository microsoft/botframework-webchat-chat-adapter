/// <reference path="../types/external.d.ts" />

import AbortController from 'abort-controller-es5';
import Observable from 'core-js/features/observable';

import { Adapter, AdapterCreator, AdapterEnhancer, AdapterOptions, ReadyState } from '../types/AdapterTypes';
import { IDirectLineActivity } from '../types/DirectLineTypes';
import shareObservable from '../utils/shareObservable';

export enum ConnectionStatus {
  Uninitialized = 0,
  Connecting = 1,
  Connected = 2
}

export interface IDirectLineJS {
  activity$: Observable<IDirectLineActivity>;
  connectionStatus$: Observable<ConnectionStatus>;
  end: () => void;
  postActivity: (activity: IDirectLineActivity) => Observable<string>;
}

export default function exportDLJSInterface(): AdapterEnhancer<IDirectLineActivity> {
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
        observer.next(ConnectionStatus.Uninitialized);
        observer.next(ConnectionStatus.Connecting);

        const errorListener = () => observer.next(ConnectionStatus.Connecting);
        const openListener = () => observer.next(ConnectionStatus.Connected);

        adapter.addEventListener('error', errorListener);
        adapter.addEventListener('open', openListener);

        return () => {
          adapter.removeEventListener('error', errorListener);
          adapter.removeEventListener('open', openListener);
        };
      }),

      postActivity(activity: IDirectLineActivity) {
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
