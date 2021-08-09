/// <reference path="../../../types/ic3/external/Model.d.ts" />

import { AdapterEnhancer, ReadyState } from '../../../types/AdapterTypes';
import { IC3AdapterState, StateKey } from '../../../types/ic3/IC3AdapterState';

import ConnectivityManager from '../../utils/ConnectivityManager';
import { IC3DirectLineActivity } from '../../../types/ic3/IC3DirectLineActivity';
import Observable from 'core-js/features/observable';
import { TelemetryEvents } from '../../../types/ic3/TelemetryEvents';
import applySetStateMiddleware from '../../../applySetStateMiddleware';
import { compose } from 'redux';
import createThreadToDirectLineActivityMapper from './mappers/createThreadToDirectLineActivityMapper';
import createTypingMessageToDirectLineActivityMapper from './mappers/createTypingMessageToDirectLineActivityMapper';
import createUserMessageToDirectLineActivityMapper from './mappers/createUserMessageToDirectLineActivityMapper';
import { logMessagefilter } from '../../../utils/logMessageFilter';
import { alreadyAcked, removeFromMessageIdSet } from '../../../utils/ackedMessageSet';

export default function createSubscribeNewMessageAndThreadUpdateEnhancer(): AdapterEnhancer<
  IC3DirectLineActivity,
  IC3AdapterState
> {
  return applySetStateMiddleware<IC3DirectLineActivity, IC3AdapterState>(({ getState, subscribe, getReadyState }) => {
    const convertMessage = compose(
      createUserMessageToDirectLineActivityMapper({ getState }),
      createTypingMessageToDirectLineActivityMapper({ getState })
    )(message => {
      getState(StateKey.Logger)?.logClientSdkTelemetryEvent(Microsoft.CRM.Omnichannel.IC3Client.Model.LogLevel.WARN,
        {
          Event: TelemetryEvents.UNKNOWN_MESSAGE_TYPE,
          Description: `Adapter: Unknown message type; ignoring message ${message}`
        }
      );
    });

    const convertThread = createThreadToDirectLineActivityMapper({ getState })(thread => {
      getState(StateKey.Logger)?.logClientSdkTelemetryEvent(Microsoft.CRM.Omnichannel.IC3Client.Model.LogLevel.WARN,
        {
          Event: TelemetryEvents.UNKNOWN_THREAD_TYPE,
          Description: `Adapter: Unknown thread type; ignoring thread ${thread}`
        }
      );
    });

    function timeout(ms: number){
      return new Promise(resolve => setTimeout(() => {
        resolve();
      }, ms));
    }

    return next => (key: keyof IC3AdapterState, value: any) => {
      key === StateKey.Conversation &&
        subscribe(
          !!value &&
            new Observable<IC3DirectLineActivity>(subscriber => {
              const conversation = value as Microsoft.CRM.Omnichannel.IC3Client.Model.IConversation;
              const next = subscriber.next.bind(subscriber);
              window.addEventListener("reinitialize", async (event) => {  
                getState(StateKey.Logger)?.logClientSdkTelemetryEvent(Microsoft.CRM.Omnichannel.IC3Client.Model.LogLevel.DEBUG,
                  {
                    Event: TelemetryEvents.REHYDRATE_MESSAGES,
                    Description: `Adapter: Re-hydrating received messages`
                  }
                );          
                if(ConnectivityManager.isInternetConnected()){
                  (await conversation.getMessages()).forEach(async message => {
                    let activity = await convertMessage(message);
                    !unsubscribed && next(activity);
                  });
                }
              });

              // TODO: Currently, there is no way to unsubscribe. We are using this flag to fake an "unregisterOnXXX".
              let unsubscribed: boolean;

              (async function () {
                let waitTime = 2;
                while((getReadyState() != ReadyState.OPEN || !getState(StateKey.ConnectionStatusObserverReady)) && waitTime <= 2048){
                  await timeout(waitTime);
                  waitTime *= 2;
                }
                //log only 
                if(waitTime > 2) {
                  getState(StateKey.Logger)?.logClientSdkTelemetryEvent(Microsoft.CRM.Omnichannel.IC3Client.Model.LogLevel.INFO,
                    {
                      Event: TelemetryEvents.ADAPTER_STATE_UPDATE,
                      Description: `Adapter: connectionStatusObserverReady state after waiting for ${waitTime} ms: `+getState(StateKey.ConnectionStatusObserverReady)
                    }
                  );
                }
                if (getReadyState() != ReadyState.OPEN) {
                  getState(StateKey.Logger)?.logClientSdkTelemetryEvent(Microsoft.CRM.Omnichannel.IC3Client.Model.LogLevel.ERROR,
                    {
                      Event: TelemetryEvents.ADAPTER_NOT_READY,
                      Description: `Adapter: Adapter not ready. ReadyState is not OPEN`
                    }
                  );
                }
                if (!getState(StateKey.ConnectionStatusObserverReady)) {
                  getState(StateKey.Logger)?.logClientSdkTelemetryEvent(Microsoft.CRM.Omnichannel.IC3Client.Model.LogLevel.ERROR,
                    {
                      Event: TelemetryEvents.ADAPTER_NOT_READY,
                      Description: `Adapter: Adapter not ready. ConnectionStatusObserverReady is false`
                    }
                  );
                }

                (await conversation.getMessages()).forEach(async message => {
                  if (unsubscribed) {
                    getState(StateKey.Logger)?.logClientSdkTelemetryEvent(Microsoft.CRM.Omnichannel.IC3Client.Model.LogLevel.ERROR,
                      {
                        Event: TelemetryEvents.ADAPTER_UNSUBSCRIBED,
                        Description: `Adapter: Unsubscribed state when trying to process getMessages`
                      }
                    );
                    return;
                  }
                  let activity: any = await convertMessage(message);
                  getState(StateKey.Logger)?.logClientSdkTelemetryEvent(Microsoft.CRM.Omnichannel.IC3Client.Model.LogLevel.DEBUG,
                    {
                      Event: TelemetryEvents.REHYDRATE_MESSAGES,
                      Description: `Adapter: rehydrate message with id ${activity.id}`,
                      CustomProperties: logMessagefilter(activity)
                    }
                  );
                  !unsubscribed && next(activity);
                });
                getState(StateKey.Logger)?.logClientSdkTelemetryEvent(Microsoft.CRM.Omnichannel.IC3Client.Model.LogLevel.DEBUG,
                  {
                    Event: TelemetryEvents.GET_MESSAGES_SUCCESS,
                    Description: `Adapter: Getting messages success`
                  }
                ); 

                conversation.registerOnNewMessage(async message => {
                  if (unsubscribed) {
                    getState(StateKey.Logger)?.logClientSdkTelemetryEvent(Microsoft.CRM.Omnichannel.IC3Client.Model.LogLevel.ERROR,
                      {
                        Event: TelemetryEvents.ADAPTER_UNSUBSCRIBED,
                        Description: `Adapter: Unsubscribed state when trying to process onNewMessage`
                      }
                    );
                    return;
                  }
                  let activity: any = await convertMessage(message);
                  getState(StateKey.Logger)?.logClientSdkTelemetryEvent(Microsoft.CRM.Omnichannel.IC3Client.Model.LogLevel.DEBUG,
                    {
                      Event: TelemetryEvents.MESSAGE_RECEIVED,
                      Description: `Adapter: Received a message with id ${activity.id}`,
                      CustomProperties: logMessagefilter(activity)
                    }
                  );
                  if(alreadyAcked(message.clientmessageid)) {
                    removeFromMessageIdSet(message.clientmessageid);
                  }
                  else {
                    !unsubscribed && next(activity);
                  }
                });
                getState(StateKey.Logger)?.logClientSdkTelemetryEvent(Microsoft.CRM.Omnichannel.IC3Client.Model.LogLevel.DEBUG,
                  {
                    Event: TelemetryEvents.REGISTER_ON_NEW_MESSAGE,
                    Description: `Adapter: Registering on new message success`
                  }
                ); 

                conversation.registerOnThreadUpdate(async thread => {
                  if (unsubscribed) {
                    getState(StateKey.Logger)?.logClientSdkTelemetryEvent(Microsoft.CRM.Omnichannel.IC3Client.Model.LogLevel.ERROR,
                      {
                        Event: TelemetryEvents.ADAPTER_UNSUBSCRIBED,
                        Description: `Adapter: Unsubscribed state when trying to process onThreadUpdate`
                      }
                    );
                    return;
                  }
                  let activity: any = await convertThread(thread);
                  getState(StateKey.Logger)?.logClientSdkTelemetryEvent(Microsoft.CRM.Omnichannel.IC3Client.Model.LogLevel.DEBUG,
                    {
                      Event: TelemetryEvents.THREAD_UPDATE_RECEIVED,
                      Description: `Adapter: Received a thread update with id ${activity.id}`,
                      CustomProperties: logMessagefilter(activity)
                    }
                  );
                  !unsubscribed && next(activity);
                });
                getState(StateKey.Logger)?.logClientSdkTelemetryEvent(Microsoft.CRM.Omnichannel.IC3Client.Model.LogLevel.DEBUG,
                  {
                    Event: TelemetryEvents.REGISTER_ON_THREAD_UPDATE,
                    Description: `Adapter: Registering on thread update success`
                  }
                ); 

                conversation.registerOnIC3ErrorRecovery(async error => {
                  if (unsubscribed) { 
                    getState(StateKey.Logger)?.logClientSdkTelemetryEvent(Microsoft.CRM.Omnichannel.IC3Client.Model.LogLevel.ERROR,
                      {
                        Event: TelemetryEvents.ADAPTER_UNSUBSCRIBED,
                        Description: `Adapter: Unsubscribed state when trying to process onIC3Error`
                      }
                    );
                    return;
                  }
                  getState(StateKey.Logger)?.logClientSdkTelemetryEvent(Microsoft.CRM.Omnichannel.IC3Client.Model.LogLevel.DEBUG,
                    {
                      Event: TelemetryEvents.IC3_ERROR_RECEIVED,
                      Description: `Adapter: Received an ic3 error ${error}`
                    }
                  );
                  (await conversation.getMessages()).forEach(async message => {
                    let activity: any = await convertMessage(message);
                    getState(StateKey.Logger)?.logClientSdkTelemetryEvent(Microsoft.CRM.Omnichannel.IC3Client.Model.LogLevel.DEBUG,
                      {
                        Event: TelemetryEvents.REHYDRATE_MESSAGES,
                        Description: `Adapter: rehydrate message with id ${activity.id} on ic3 error`,
                        CustomProperties: logMessagefilter(activity)
                      }
                    );
                    !unsubscribed && next(activity);
                  });
                });
                getState(StateKey.Logger)?.logClientSdkTelemetryEvent(Microsoft.CRM.Omnichannel.IC3Client.Model.LogLevel.DEBUG,
                  {
                    Event: TelemetryEvents.REGISTER_ON_IC3_ERROR,
                    Description: `Adapter: Registering on ic3 error success`
                  }
                ); 
              })();

              return () => {
                unsubscribed = true;
              };
            })
        );

      return next(key, value);
    };
  });
}
