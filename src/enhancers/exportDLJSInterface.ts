/// <reference path="../types/external.d.ts" />

import {
  Adapter,
  AdapterCreator,
  AdapterEnhancer,
  AdapterOptions,
  AdapterState,
  ReadyState
} from '../types/AdapterTypes';
import { ConnectionStatusObserverNotReadyError, ConnectionStatusObserverWaitingTime } from '../ic3/Constants';
import Observable, { Observer } from 'core-js/features/observable';

import AbortController from 'abort-controller-es5';
import { ConversationControllCallbackOnEvent } from '../ic3/createAdapterEnhancer';
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
    adapter.getState(StateKey.Logger)?.logClientSdkTelemetryEvent(Microsoft.CRM.Omnichannel.IC3Client.Model.LogLevel.DEBUG,
      {
        Event: TelemetryEvents.ADAPTER_DL_INTERFACE_EVENT,
        Description: `Adapter: Creating DL interface with adapter ID: ${adapter.id} ic3 chat ID: ${adapter.getState(StateKey.ChatId)}`
      }
    );
    let waitedTime = 2;
    adapter.addEventListener('open', async (event) => {
      if(!connectionStatusObserver){
        adapter.getState(StateKey.Logger)?.logClientSdkTelemetryEvent(Microsoft.CRM.Omnichannel.IC3Client.Model.LogLevel.WARN,
          {
            Event: TelemetryEvents.ADAPTER_NOT_READY,
            Description: `Adapter: ConnectionStatusObserver is null, start waiting!`,
            CustomProperties: {
              eventType: event?.type
            }
          }
        );
        while(!connectionStatusObserver && waitedTime <= ConnectionStatusObserverWaitingTime){
          await timeout(waitedTime);
          waitedTime = waitedTime*2;
        }
      }
      if (!connectionStatusObserver) {
        adapter.getState(StateKey.Logger)?.logClientSdkTelemetryEvent(Microsoft.CRM.Omnichannel.IC3Client.Model.LogLevel.ERROR,
          {
            Event: TelemetryEvents.ADAPTER_NOT_READY,
            Description: `Adapter: Adapter not ready. ConnectionStatusObserver is null. Wait time: ${waitedTime}.`
          }
        );
        try {
          ConversationControllCallbackOnEvent({
            errorCode: ConnectionStatusObserverNotReadyError,
            message: `Adapter: adapter ID: ${adapter.id}`,
            property: {
              conversationId: adapter.getState(StateKey.ChatId) || ""
            }
          });
        } catch (error) {
          adapter.getState(StateKey.Logger)?.logClientSdkTelemetryEvent(Microsoft.CRM.Omnichannel.IC3Client.Model.LogLevel.ERROR,
            {
              Event: TelemetryEvents.ADAPTER_NOT_READY,
              Description: `Adapter: Adapter not ready. Failed to call.`,
              ExceptionDetails: error
            }
          );
        }
      }
      else {
        adapter.getState(StateKey.Logger)?.logClientSdkTelemetryEvent(Microsoft.CRM.Omnichannel.IC3Client.Model.LogLevel.DEBUG,
          {
            Event: TelemetryEvents.ADAPTER_DL_INTERFACE_EVENT,
            Description: `Adapter: ConnectionStatusObserver dispatched connected event!`
          }
        );
        connectionStatusObserver.next(ConnectionStatus.Connected);
      }
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

    let dlAdapter = {
      ...adapter,

      activity$: shareObservable(
        new Observable(observer => {
          const abortController = new AbortController();

          (async function () {
            try {
              for await (const activity of adapter.activities({ signal: abortController.signal })) {
                adapter.getState(StateKey.Logger)?.logClientSdkTelemetryEvent(Microsoft.CRM.Omnichannel.IC3Client.Model.LogLevel.DEBUG,
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
              adapter.getState(StateKey.Logger)?.logClientSdkTelemetryEvent(Microsoft.CRM.Omnichannel.IC3Client.Model.LogLevel.ERROR,
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
        }),
        "activity generator",
        adapter.getState(StateKey.Logger)
      ),
      connectionStatus$: shareObservable(
        new Observable((observer: any) => {
          observer.next(ConnectionStatus.Uninitialized);
          observer.next(ConnectionStatus.Connecting);
          connectionStatusObserver = observer;
          adapter.getState(StateKey.Logger)?.logClientSdkTelemetryEvent(Microsoft.CRM.Omnichannel.IC3Client.Model.LogLevel.DEBUG,
            {
              Event: TelemetryEvents.ADAPTER_DL_INTERFACE_EVENT,
              Description: `Adapter: connection status observer subscribed`,
              CustomProperties: {
                ObserverStatus: observer?.closed? "observer closed": "observer opened"
              }
            }
          );

          return () => {
            adapter.getState(StateKey.Logger)?.logClientSdkTelemetryEvent(Microsoft.CRM.Omnichannel.IC3Client.Model.LogLevel.DEBUG,
              {
                Event: TelemetryEvents.ADAPTER_DL_INTERFACE_EVENT,
                Description: `Adapter: connection status observer unsubscribed`
              }
            );
            connectionStatusObserver = undefined;
          };
        }),
        "connectionStatus generator",
        adapter.getState(StateKey.Logger)
      ),

      end: () => {
        adapter.getState(StateKey.Logger)?.logClientSdkTelemetryEvent(Microsoft.CRM.Omnichannel.IC3Client.Model.LogLevel.DEBUG,
          {
            Event: TelemetryEvents.ADAPTER_DL_INTERFACE_EVENT,
            Description: `Adapter: ended`,
          }
        );
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
    adapter.getState(StateKey.Logger)?.logClientSdkTelemetryEvent(Microsoft.CRM.Omnichannel.IC3Client.Model.LogLevel.DEBUG,
      {
        Event: TelemetryEvents.ADAPTER_DL_INTERFACE_EVENT,
        Description: `Adapter: directline interface initialized successful`,
        CustomProperties: {
          "Adapter ID": adapter.id,
          "chat ID": adapter.getState(StateKey.ChatId)
        }
      }
    );
    return dlAdapter;
  };
}
