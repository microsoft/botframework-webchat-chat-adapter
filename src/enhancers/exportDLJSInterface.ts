/// <reference path="../types/external.d.ts" />

import {
  Adapter,
  AdapterCreator,
  AdapterEnhancer,
  AdapterOptions,
  AdapterState,
  ReadyState
} from '../types/AdapterTypes';
import Observable, { Observer } from 'core-js/features/observable';

import AbortController from 'abort-controller-es5';
import { IDirectLineActivity } from '../types/DirectLineTypes';
import { StateKey } from '../types/ic3/IC3AdapterState';
import { TelemetryEvents } from '../types/ic3/TelemetryEvents';
import { logMessagefilter } from '../utils/logMessageFilter';
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

function timeout(ms: number){
  return new Promise(resolve => setTimeout(() => {
    resolve();
  }, ms));
}

export default function exportDLJSInterface<TAdapterState extends AdapterState>(): AdapterEnhancer<
  IDirectLineActivity,
  TAdapterState
> {
  return (next: AdapterCreator<IDirectLineActivity, TAdapterState>) => (
    options: AdapterOptions
  ): Adapter<IDirectLineActivity, TAdapterState> & IDirectLineJS => {
    const adapter = next(options);
    let connectionStatusObserver: Observer<ConnectionStatus>;

    adapter.addEventListener('open', async () => {
      if(!connectionStatusObserver){
        adapter.getState(StateKey.Logger)?.logClientSdkTelemetryEvent(Microsoft.CRM.Omnichannel.IC3Client.Model.LogLevel.ERROR,
          {
            Event: TelemetryEvents.ADAPTER_NOT_READY,
            Description: `Adapter: ConnectionStatusObserver is null, start waiting!`
          }
        );
        let waitTime = 2;
        while(!connectionStatusObserver && waitTime <= 2048){
          await timeout(waitTime);
          waitTime = waitTime*2;
        }

        if (!connectionStatusObserver) {
          adapter.getState(StateKey.Logger)?.logClientSdkTelemetryEvent(Microsoft.CRM.Omnichannel.IC3Client.Model.LogLevel.ERROR,
            {
              Event: TelemetryEvents.ADAPTER_NOT_READY,
              Description: `Adapter: Adapter not ready. ConnectionStatusObserver is null. Wait time: ${waitTime}.`
            }
          );
        }
      }
      connectionStatusObserver.next(ConnectionStatus.Connected);
      adapter.setState(StateKey.ConnectionStatusObserverReady, true);
      adapter.getState(StateKey.Logger)?.logClientSdkTelemetryEvent(Microsoft.CRM.Omnichannel.IC3Client.Model.LogLevel.INFO,
        {
          Event: TelemetryEvents.ADAPTER_STATE_UPDATE,
          Description: `Adapter: ConnectionStatusObserverReady has been set to true.`
        }
      );
    });

    adapter.addEventListener('error', () => {
      adapter.getState(StateKey.Logger)?.logClientSdkTelemetryEvent(Microsoft.CRM.Omnichannel.IC3Client.Model.LogLevel.ERROR,
        {
          Event: TelemetryEvents.ADAPTER_NOT_READY,
          Description: `Adapter: connection received error event!`
        }
      );
      connectionStatusObserver.next(
        adapter.getReadyState() === ReadyState.CLOSED ? ConnectionStatus.FailedToConnect : ConnectionStatus.Connecting
      );
    });

    return {
      ...adapter,

      activity$: shareObservable(
        new Observable(observer => {
          const abortController = new AbortController();

          (async function () {
            try {
              for await (const activity of adapter.activities({ signal: abortController.signal })) {
                (window as any).ic3Logger?.logClientSdkTelemetryEvent(Microsoft.CRM.Omnichannel.IC3Client.Model.LogLevel.DEBUG,
                  {
                    Event: TelemetryEvents.MESSAGE_RECEIVED,
                    Description: `Adapter: Posted a message to DL interface with id ${activity.id}`,
                  }
                );
                observer.next(activity);
              }

              observer.complete();
            } catch (error) {
              observer.error(error);
              (window as any).ic3Logger?.logClientSdkTelemetryEvent(Microsoft.CRM.Omnichannel.IC3Client.Model.LogLevel.ERROR,
                {
                  Event: TelemetryEvents.ADAPTER_NOT_READY,
                  Description: `Adapter: failed to post message to DL interface`,
                  ExceptionDetails: error
                }
              );
            }
          })();

          return () => {
            abortController.abort();
          };
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

      end: () => {
        adapter.close();
      },

      postActivity(activity: IDirectLineActivity) {
        return new Observable(observer => {
          (async function () {
            adapter.getState(StateKey.Logger)?.logClientSdkTelemetryEvent(Microsoft.CRM.Omnichannel.IC3Client.Model.LogLevel.DEBUG,
              {
                Event: TelemetryEvents.MESSAGE_POSTED_TO_EGRESS,
                Description: `Adapter: Posting message to egress middleware.`,
                CustomProperties: logMessagefilter(activity)
              }
            );
            await adapter.egress(activity, 
              {
              progress: ({ id }: { id?: string }) => id && observer.next(id)
            });
            //await adapter.ingress({...activity, id: uniqueId()}); //No need to call ingress as IC3 is providing echo back. If we need this for DL, a new class for IC3 should be created
            observer.complete();
          })();
        });
      }
    };
  };
}
