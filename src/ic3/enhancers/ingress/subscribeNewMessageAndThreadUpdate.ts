/// <reference path="../../../types/ic3/external/Model.d.ts" />

import { AdapterEnhancer, ReadyState } from '../../../types/AdapterTypes';
import { IC3AdapterState, StateKey } from '../../../types/ic3/IC3AdapterState';

import ConnectivityManager from '../../utils/ConnectivityManager';
import { IC3DirectLineActivity } from '../../../types/ic3/IC3DirectLineActivity';
import Observable from 'core-js/features/observable';
import applySetStateMiddleware from '../../../applySetStateMiddleware';
import { compose } from 'redux';
import createThreadToDirectLineActivityMapper from './mappers/createThreadToDirectLineActivityMapper';
import createTypingMessageToDirectLineActivityMapper from './mappers/createTypingMessageToDirectLineActivityMapper';
import createUserMessageToDirectLineActivityMapper from './mappers/createUserMessageToDirectLineActivityMapper';
import { TelemetryEvents } from '../../../types/ic3/TelemetryEvents';

export default function createSubscribeNewMessageAndThreadUpdateEnhancer(): AdapterEnhancer<
  IC3DirectLineActivity,
  IC3AdapterState
> {
  return applySetStateMiddleware<IC3DirectLineActivity, IC3AdapterState>(({ getState, subscribe, getReadyState }) => {
    const logger = getState(StateKey.AdapterLogger);

    const convertMessage = compose(
      createUserMessageToDirectLineActivityMapper({ getState }),
      createTypingMessageToDirectLineActivityMapper({ getState })
    )(message => {
      logger.warn(TelemetryEvents.UNKNOWN_MESSAGE_TYPE, {
        Description: `Adapter: Unknown message type; ignoring message ${message}`
      });
    });

    const convertThread = createThreadToDirectLineActivityMapper({ getState })(thread => {
      logger.warn(TelemetryEvents.UNKNOWN_THREAD_TYPE, {
        Description: `Adapter: Unknown thread type; ignoring thread ${thread}`
      });
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
                logger.debug(TelemetryEvents.REHYDRATE_MESSAGES, {
                  Description: `Re-hydrating received messages`
                });          
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
                let waitTime = 5;
                while(getReadyState() != ReadyState.OPEN && waitTime < 3000){
                  await timeout(waitTime);
                  waitTime *= 2;
                }
                (await conversation.getMessages()).forEach(async message => {
                  if (unsubscribed) { return; }
                  let activity = await convertMessage(message);
                  !unsubscribed && next(activity);
                });
                logger.debug(TelemetryEvents.GET_MESSAGES_SUCCESS, {
                  Description: `Getting messages success on conv ${conversation.id}`
                }); 

                conversation.registerOnNewMessage(async message => {
                  if (unsubscribed) { return; }
                  let activity: any = await convertMessage(message);
                  !unsubscribed && next(activity);
                });
                logger.debug(TelemetryEvents.REGISTER_ON_NEW_MESSAGE, {
                  Description: `Registering on new message success on conv ${conversation.id}`
                }); 

                conversation.registerOnThreadUpdate(async thread => {
                  if (unsubscribed) { return; }
                  !unsubscribed && next(await convertThread(thread));
                });
                logger.debug(TelemetryEvents.REGISTER_ON_THREAD_UPDATE, {
                  Description: `Registering on thread update success on conv ${conversation.id}`
                }); 
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
