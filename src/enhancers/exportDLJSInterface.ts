/// <reference path="../types/external.d.ts" />

import AbortController from 'abort-controller-es5';
import Observable, { Observer } from 'core-js/features/observable';

import { AdapterCreator, AdapterEnhancer, AdapterOptions, InterimAdapter, ReadyState } from '../types/AdapterTypes';
import { IDirectLineActivity } from '../types/DirectLineTypes';
import shareObservable from '../utils/shareObservable';

export enum ConnectionStatus {
  Uninitialized = 0,
  Connecting = 1,
  Connected = 2,
  FailedToConnect = 4
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
  ): InterimAdapter<IDirectLineActivity> & IDirectLineJS => {
    const adapter = next(options);
    let connectionStatusObserver: Observer<ConnectionStatus>;

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

      connectionStatus$: shareObservable(
        new Observable(observer => {
          observer.next(ConnectionStatus.Uninitialized);
          observer.next(ConnectionStatus.Connecting);

          connectionStatusObserver = observer;

          return () => {
            connectionStatusObserver = undefined;
          };
        })
      ),

      end: () => adapter.close(),

      postActivity(activity: IDirectLineActivity) {
        return new Observable(observer => {
          adapter
            .egress(activity, {
              progress: ({ id }) => id && observer.next(id)
            })
            .then(() => observer.complete());
        });
      },

      setReadyState(readyState: ReadyState) {
        if (!connectionStatusObserver) {
          return;
        }

        switch (readyState) {
          case ReadyState.CONNECTING:
            connectionStatusObserver.next(ConnectionStatus.Connecting);
            break;

          case ReadyState.OPEN:
            connectionStatusObserver.next(ConnectionStatus.Connected);
            break;

          case ReadyState.CLOSED:
            connectionStatusObserver.next(ConnectionStatus.FailedToConnect);
            break;
        }

        adapter.setReadyState(readyState);
      }
    };
  };
}
