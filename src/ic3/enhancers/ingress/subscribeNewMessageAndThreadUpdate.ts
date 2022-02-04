/// <reference path="../../../types/ic3/external/Model.d.ts" />

import { AdapterEnhancer, ReadyState } from '../../../types/AdapterTypes';
import { ConnectionStatusObserverWaitingTime, MissingAckFromPollingError, Reinitialize, ReloadAllMessageInterval, TranslationMessageTag } from '../../Constants';
import { IC3AdapterState, StateKey } from '../../../types/ic3/IC3AdapterState';
import { addToMessageIdMap, alreadyAcked } from '../../../utils/ackedMessageMap';
import { extendError, logMessagefilter, stringifyHelper } from '../../../utils/logMessageFilter';

import ConnectivityManager from '../../utils/ConnectivityManager';
import { ConversationControllCallbackOnEvent } from '../../createAdapterEnhancer';
import { IC3DirectLineActivity } from '../../../types/ic3/IC3DirectLineActivity';
import Observable from 'core-js/features/observable';
import { TelemetryEvents } from '../../../types/ic3/TelemetryEvents';
import applySetStateMiddleware from '../../../applySetStateMiddleware';
import { compose } from 'redux';
import createThreadToDirectLineActivityMapper from './mappers/createThreadToDirectLineActivityMapper';
import createTypingMessageToDirectLineActivityMapper from './mappers/createTypingMessageToDirectLineActivityMapper';
import createUserMessageToDirectLineActivityMapper from './mappers/createUserMessageToDirectLineActivityMapper';

export default function createSubscribeNewMessageAndThreadUpdateEnhancer(): AdapterEnhancer<
  IC3DirectLineActivity,
  IC3AdapterState
> {
  return applySetStateMiddleware<IC3DirectLineActivity, IC3AdapterState>((adapterMiddleware) => {
    const { getState, subscribe, getReadyState } = adapterMiddleware;
    const convertMessage = compose(
      createUserMessageToDirectLineActivityMapper({ getState }),
      createTypingMessageToDirectLineActivityMapper({ getState })
    )(message => {
      getState(StateKey.Logger)?.logClientSdkTelemetryEvent(Microsoft.CRM.Omnichannel.IC3Client.Model.LogLevel.WARN,
        {
          Event: TelemetryEvents.UNKNOWN_MESSAGE_TYPE,
          Description: `Adapter: Unknown message type; ignoring message ${message?.messageid}`,
          CustomProperties: stringifyHelper({
            messageId: message?.messageid,
            [StateKey.ChatId]: getState(StateKey.ChatId),
            [StateKey.LiveworkItemId]: getState(StateKey.LiveworkItemId)
          })
        }
      );
    });

    const convertThread = createThreadToDirectLineActivityMapper({ getState })(thread => {
      getState(StateKey.Logger)?.logClientSdkTelemetryEvent(Microsoft.CRM.Omnichannel.IC3Client.Model.LogLevel.WARN,
        {
          Event: TelemetryEvents.UNKNOWN_THREAD_TYPE,
          Description: `Adapter: Unknown thread type; ignoring thread ${thread?.id}`,
          CustomProperties: stringifyHelper({
            threadId: thread?.id,
            [StateKey.ChatId]: getState(StateKey.ChatId),
            [StateKey.LiveworkItemId]: getState(StateKey.LiveworkItemId)
          })
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
              let triggerReload = false;
              let fetchingInProcess = false;
              // TODO: Currently, there is no way to unsubscribe. We are using this flag to fake an "unregisterOnXXX".
              let unsubscribed: boolean;
              let reloadTimer  = window.setInterval(() => {
                if (triggerReload && conversation && !unsubscribed && !fetchingInProcess) {
                  getState(StateKey.Logger)?.logClientSdkTelemetryEvent(Microsoft.CRM.Omnichannel.IC3Client.Model.LogLevel.DEBUG,
                    {
                      Event: TelemetryEvents.REHYDRATE_MESSAGES,
                      Description: `Adapter: Reload all messages due to poll ack missing`,
                      CustomProperties: stringifyHelper({
                        [StateKey.ChatId]: getState(StateKey.ChatId),
                        [StateKey.LiveworkItemId]: getState(StateKey.LiveworkItemId)
                      })
                    }
                  );
                  reloadMessages();
                }
              }, ReloadAllMessageInterval);
              let agentMessagesSeen: Set<string> = new Set();

              const reloadMessages = async () => {
                fetchingInProcess = true;
                const allMessages = await conversation.getMessages();
                allMessages.forEach(async message => {
                  const { clientmessageid, messageType, deliveryMode } = message;
                  const isUserMessage = (messageType === Microsoft.CRM.Omnichannel.IC3Client.Model.MessageType.UserMessage)
                    && (deliveryMode === Microsoft.CRM.Omnichannel.IC3Client.Model.DeliveryMode.Bridged);
                    if (clientmessageid && isUserMessage && !agentMessagesSeen.has(clientmessageid)) {
                      let activity = await convertMessage(message);
                      agentMessagesSeen.add(clientmessageid);
                      !unsubscribed && next(activity);
                    }
                });
                getState(StateKey.Logger)?.logClientSdkTelemetryEvent(Microsoft.CRM.Omnichannel.IC3Client.Model.LogLevel.DEBUG,
                  {
                    Event: TelemetryEvents.REHYDRATE_MESSAGES,
                    Description: `Adapter: reloaded ${allMessages?.length} messages`,
                    CustomProperties: stringifyHelper({
                      [StateKey.ChatId]: getState(StateKey.ChatId),
                      [StateKey.LiveworkItemId]: getState(StateKey.LiveworkItemId)
                    })
                  }
                );
                fetchingInProcess = false;
              }

              window.addEventListener(Reinitialize, async (event) => {  
                getState(StateKey.Logger)?.logClientSdkTelemetryEvent(Microsoft.CRM.Omnichannel.IC3Client.Model.LogLevel.DEBUG,
                  {
                    Event: TelemetryEvents.REHYDRATE_MESSAGES,
                    Description: `Adapter: Re-hydrating received messages`,
                    CustomProperties: stringifyHelper({
                      [StateKey.ChatId]: getState(StateKey.ChatId),
                      [StateKey.LiveworkItemId]: getState(StateKey.LiveworkItemId)
                    })
                  }
                );
                if(ConnectivityManager.isInternetConnected()){
                  reloadMessages();
                }
              });

              (async function () {
                let waitTime = 2;
                while((getReadyState() != ReadyState.OPEN || !getState(StateKey.ConnectionStatusObserverReady)) && waitTime <= ConnectionStatusObserverWaitingTime){
                  await timeout(waitTime);
                  waitTime *= 2;
                }
                //log only 
                if(waitTime > 2) {
                  getState(StateKey.Logger)?.logClientSdkTelemetryEvent(Microsoft.CRM.Omnichannel.IC3Client.Model.LogLevel.INFO,
                    {
                      Event: TelemetryEvents.ADAPTER_STATE_UPDATE,
                      Description: `Adapter: connectionStatusObserverReady state after waiting for ${waitTime} ms: `+getState(StateKey.ConnectionStatusObserverReady),
                      CustomProperties: stringifyHelper({
                        [StateKey.ChatId]: getState(StateKey.ChatId),
                        [StateKey.LiveworkItemId]: getState(StateKey.LiveworkItemId)
                      })
                    }
                  );
                }
                if (getReadyState() != ReadyState.OPEN) {
                  getState(StateKey.Logger)?.logClientSdkTelemetryEvent(Microsoft.CRM.Omnichannel.IC3Client.Model.LogLevel.ERROR,
                    {
                      Event: TelemetryEvents.ADAPTER_NOT_READY,
                      Description: `Adapter: Adapter not ready. ReadyState is not OPEN`,
                      CustomProperties: stringifyHelper({
                        [StateKey.ChatId]: getState(StateKey.ChatId),
                        [StateKey.LiveworkItemId]: getState(StateKey.LiveworkItemId)
                      })
                    }
                  );
                }
                if (!getState(StateKey.ConnectionStatusObserverReady)) {
                  getState(StateKey.Logger)?.logClientSdkTelemetryEvent(Microsoft.CRM.Omnichannel.IC3Client.Model.LogLevel.ERROR,
                    {
                      Event: TelemetryEvents.ADAPTER_NOT_READY,
                      Description: `Adapter: Adapter not ready. ConnectionStatusObserverReady is false: adapter ID: ${adapterMiddleware.id}`,
                      CustomProperties: stringifyHelper({
                        [StateKey.ChatId]: getState(StateKey.ChatId),
                        [StateKey.LiveworkItemId]: getState(StateKey.LiveworkItemId)
                      })
                    }
                  );
                }

                (await conversation.getMessages()).forEach(async message => {
                  if (unsubscribed) {
                    getState(StateKey.Logger)?.logClientSdkTelemetryEvent(Microsoft.CRM.Omnichannel.IC3Client.Model.LogLevel.ERROR,
                      {
                        Event: TelemetryEvents.ADAPTER_UNSUBSCRIBED,
                        Description: `Adapter: Unsubscribed state when trying to process getMessages`,
                        CustomProperties: stringifyHelper({
                          [StateKey.ChatId]: getState(StateKey.ChatId),
                          [StateKey.LiveworkItemId]: getState(StateKey.LiveworkItemId)
                        })
                      }
                    );
                    return;
                  }
                  let activity: any = await convertMessage(message);
                  getState(StateKey.Logger)?.logClientSdkTelemetryEvent(Microsoft.CRM.Omnichannel.IC3Client.Model.LogLevel.DEBUG,
                    {
                      Event: TelemetryEvents.REHYDRATE_MESSAGES,
                      Description: `Adapter: rehydrate message with id ${activity.id}`,
                      CustomProperties: stringifyHelper({
                        activity: logMessagefilter(activity),
                        [StateKey.ChatId]: getState(StateKey.ChatId),
                        [StateKey.LiveworkItemId]: getState(StateKey.LiveworkItemId)
                      })
                    }
                  );
                  !unsubscribed && next(activity);
                });
                getState(StateKey.Logger)?.logClientSdkTelemetryEvent(Microsoft.CRM.Omnichannel.IC3Client.Model.LogLevel.DEBUG,
                  {
                    Event: TelemetryEvents.GET_MESSAGES_SUCCESS,
                    Description: `Adapter: Getting messages success`,
                    CustomProperties: stringifyHelper({
                      [StateKey.ChatId]: getState(StateKey.ChatId),
                      [StateKey.LiveworkItemId]: getState(StateKey.LiveworkItemId)
                    })
                  }
                ); 

                conversation.registerOnNewMessage(async message => {
                  let activity: any = await convertMessage(message);
                  if (unsubscribed) {
                    getState(StateKey.Logger)?.logClientSdkTelemetryEvent(Microsoft.CRM.Omnichannel.IC3Client.Model.LogLevel.WARN,
                      {
                        Event: TelemetryEvents.ADAPTER_UNSUBSCRIBED,
                        Description: `Adapter: Unsubscribed state when trying to process onNewMessage, webchat control may be already closed. ${logMessagefilter(activity)}`,
                        CustomProperties: stringifyHelper({
                          [StateKey.ChatId]: getState(StateKey.ChatId),
                          [StateKey.LiveworkItemId]: getState(StateKey.LiveworkItemId)
                        })
                      }
                    );
                    return;
                  }
                  getState(StateKey.Logger)?.logClientSdkTelemetryEvent(Microsoft.CRM.Omnichannel.IC3Client.Model.LogLevel.DEBUG,
                    {
                      Event: TelemetryEvents.MESSAGE_RECEIVED,
                      Description: `Adapter: Received a message with id ${activity.id}`,
                      CustomProperties: stringifyHelper({
                        activity: logMessagefilter(activity),
                        [StateKey.ChatId]: getState(StateKey.ChatId),
                        [StateKey.LiveworkItemId]: getState(StateKey.LiveworkItemId)
                      })
                    }
                  );
                  // the receipt message had been successfully polled back, add to map to avoid further update on the activity status
                  if (!alreadyAcked(message.clientmessageid)) {
                    addToMessageIdMap(message.clientmessageid);
                  }
                  !unsubscribed && next(activity);
                });
                getState(StateKey.Logger)?.logClientSdkTelemetryEvent(Microsoft.CRM.Omnichannel.IC3Client.Model.LogLevel.DEBUG,
                  {
                    Event: TelemetryEvents.REGISTER_ON_NEW_MESSAGE,
                    Description: `Adapter: Registering on new message success`,
                    CustomProperties: stringifyHelper({
                      [StateKey.ChatId]: getState(StateKey.ChatId),
                      [StateKey.LiveworkItemId]: getState(StateKey.LiveworkItemId)
                    })
                  }
                ); 

                conversation.registerOnThreadUpdate(async thread => {
                  if (unsubscribed) {
                    getState(StateKey.Logger)?.logClientSdkTelemetryEvent(Microsoft.CRM.Omnichannel.IC3Client.Model.LogLevel.ERROR,
                      {
                        Event: TelemetryEvents.ADAPTER_UNSUBSCRIBED,
                        Description: `Adapter: Unsubscribed state when trying to process onThreadUpdate`,
                        CustomProperties: stringifyHelper({
                          [StateKey.ChatId]: getState(StateKey.ChatId),
                          [StateKey.LiveworkItemId]: getState(StateKey.LiveworkItemId)
                        })
                      }
                    );
                    return;
                  }
                  let activity: any = await convertThread(thread);
                  getState(StateKey.Logger)?.logClientSdkTelemetryEvent(Microsoft.CRM.Omnichannel.IC3Client.Model.LogLevel.DEBUG,
                    {
                      Event: TelemetryEvents.THREAD_UPDATE_RECEIVED,
                      Description: `Adapter: Received a thread update with id ${activity.id}`,
                      CustomProperties: stringifyHelper({
                        activity: logMessagefilter(activity),
                        [StateKey.ChatId]: getState(StateKey.ChatId),
                        [StateKey.LiveworkItemId]: getState(StateKey.LiveworkItemId)
                      })
                    }
                  );
                  !unsubscribed && next(activity);
                });
                getState(StateKey.Logger)?.logClientSdkTelemetryEvent(Microsoft.CRM.Omnichannel.IC3Client.Model.LogLevel.DEBUG,
                  {
                    Event: TelemetryEvents.REGISTER_ON_THREAD_UPDATE,
                    Description: `Adapter: Registering on thread update success`,
                    CustomProperties: stringifyHelper({
                      [StateKey.ChatId]: getState(StateKey.ChatId),
                      [StateKey.LiveworkItemId]: getState(StateKey.LiveworkItemId)
                    })
                  }
                );

                conversation.registerOnIC3FatalError((error) => {
                  if (unsubscribed) {
                    getState(StateKey.Logger)?.logClientSdkTelemetryEvent(Microsoft.CRM.Omnichannel.IC3Client.Model.LogLevel.ERROR,
                      {
                        Event: TelemetryEvents.TRIGGER_IC3_FATAL_ERROR,
                        Description: `Adapter: triggering on IC3 fatal error but adapter already unsubscribed`,
                        CustomProperties: stringifyHelper({
                          [StateKey.ChatId]: getState(StateKey.ChatId),
                          [StateKey.LiveworkItemId]: getState(StateKey.LiveworkItemId)
                        })
                      }
                    );
                    return;
                  }
                  if (error.errorCode === MissingAckFromPollingError) {
                    getState(StateKey.Logger)?.logClientSdkTelemetryEvent(Microsoft.CRM.Omnichannel.IC3Client.Model.LogLevel.ERROR,
                      {
                        Event: TelemetryEvents.TRIGGER_IC3_FATAL_ERROR,
                        Description: `Adapter: missing ack from long poll for message: ${error.messages} for conversation: ${conversation?.id}`,
                        CustomProperties: stringifyHelper({
                          [StateKey.ChatId]: getState(StateKey.ChatId),
                          [StateKey.LiveworkItemId]: getState(StateKey.LiveworkItemId)
                        })
                      }
                    );
                    triggerReload = true;
                    if (ConversationControllCallbackOnEvent) ConversationControllCallbackOnEvent({errorCode: MissingAckFromPollingError, message: "Ack message on polling failed"});
                  }
                });

                conversation.registerOnIC3ErrorRecovery(async error => {
                  if (unsubscribed) { 
                    getState(StateKey.Logger)?.logClientSdkTelemetryEvent(Microsoft.CRM.Omnichannel.IC3Client.Model.LogLevel.ERROR,
                      {
                        Event: TelemetryEvents.ADAPTER_UNSUBSCRIBED,
                        Description: `Adapter: Unsubscribed state when trying to process onIC3Error`,
                        CustomProperties: stringifyHelper({
                          [StateKey.ChatId]: getState(StateKey.ChatId),
                          [StateKey.LiveworkItemId]: getState(StateKey.LiveworkItemId)
                        })
                      }
                    );
                    return;
                  }

                  if (error.errorCode === MissingAckFromPollingError) {
                    if (triggerReload) {
                      getState(StateKey.Logger)?.logClientSdkTelemetryEvent(Microsoft.CRM.Omnichannel.IC3Client.Model.LogLevel.DEBUG,
                        {
                          Event: TelemetryEvents.REGISTER_ON_IC3_ERROR_RECOVERY,
                          Description: `Adapter: recovered from missing ack from polling error`,
                          CustomProperties: stringifyHelper({
                            error: extendError(error),
                            [StateKey.ChatId]: getState(StateKey.ChatId),
                            [StateKey.LiveworkItemId]: getState(StateKey.LiveworkItemId)
                          })
                        }
                      ); 
                      triggerReload = false;
                    }
                  }

                  getState(StateKey.Logger)?.logClientSdkTelemetryEvent(Microsoft.CRM.Omnichannel.IC3Client.Model.LogLevel.DEBUG,
                    {
                      Event: TelemetryEvents.IC3_ERROR_RECEIVED,
                      Description: `Adapter: Received an ic3 error`,
                      CustomProperties: stringifyHelper({
                        error: extendError(error),
                        [StateKey.ChatId]: getState(StateKey.ChatId),
                        [StateKey.LiveworkItemId]: getState(StateKey.LiveworkItemId)
                      })
                    }
                  );
                  (await conversation.getMessages()).forEach(async message => {
                    let activity: any = await convertMessage(message);
                    getState(StateKey.Logger)?.logClientSdkTelemetryEvent(Microsoft.CRM.Omnichannel.IC3Client.Model.LogLevel.DEBUG,
                      {
                        Event: TelemetryEvents.REHYDRATE_MESSAGES,
                        Description: `Adapter: rehydrate message with id ${activity.id} on ic3 error`,
                        CustomProperties: stringifyHelper({
                          activity: logMessagefilter(activity),
                          [StateKey.ChatId]: getState(StateKey.ChatId),
                          [StateKey.LiveworkItemId]: getState(StateKey.LiveworkItemId)
                        })
                      }
                    );
                    !unsubscribed && next(activity);
                  });
                });
                getState(StateKey.Logger)?.logClientSdkTelemetryEvent(Microsoft.CRM.Omnichannel.IC3Client.Model.LogLevel.DEBUG,
                  {
                    Event: TelemetryEvents.REGISTER_ON_IC3_ERROR,
                    Description: `Adapter: Registering on ic3 error success`,
                    CustomProperties: stringifyHelper({
                      [StateKey.ChatId]: getState(StateKey.ChatId),
                      [StateKey.LiveworkItemId]: getState(StateKey.LiveworkItemId)
                    })
                  }
                ); 
              })();

              return () => {
                unsubscribed = true;
                if (reloadTimer === 0 || !!reloadTimer) clearInterval(reloadTimer);
              };
            })
        );
      return next(key, value);
    };
  });
}
