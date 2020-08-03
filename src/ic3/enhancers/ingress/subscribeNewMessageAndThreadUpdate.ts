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
import { warn } from '../../telemetry/logger';
import { TELEMETRY_EVENT_UNKNOWN_MESSAGE_TYPE } from '../../telemetry/telemetryEvents';

export default function createSubscribeNewMessageAndThreadUpdateEnhancer(): AdapterEnhancer<
  IC3DirectLineActivity,
  IC3AdapterState
> {
  return applySetStateMiddleware<IC3DirectLineActivity, IC3AdapterState>(({ getState, subscribe, getReadyState }) => {
    const convertMessage = compose(
      createUserMessageToDirectLineActivityMapper({ getState }),
      createTypingMessageToDirectLineActivityMapper({ getState })
    )(message => {
      warn(TELEMETRY_EVENT_UNKNOWN_MESSAGE_TYPE, {
        Description: `Adapter: Unknown message type; ignoring message ${message}`
      });
    });

    const convertThread = createThreadToDirectLineActivityMapper({ getState })(thread => {
      warn(TELEMETRY_EVENT_UNKNOWN_MESSAGE_TYPE, {
        Description: `Adapter: Unknown message type; ignoring message ${thread}`
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

                conversation.registerOnNewMessage(async message => {
                  if (unsubscribed) { return; }
                  let activity: any = await convertMessage(message);
                  !unsubscribed && next(activity);
                });

                conversation.registerOnThreadUpdate(async thread => {
                  if (unsubscribed) { return; }
                  !unsubscribed && next(await convertThread(thread));
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
