/// <reference path="../../../types/ic3/external/Model.d.ts" />

import { IC3AdapterState, StateKey } from '../../../types/ic3/IC3AdapterState';

import { AdapterEnhancer } from '../../../types/AdapterTypes';
import { IC3DirectLineActivity } from '../../../types/ic3/IC3DirectLineActivity';
import Observable from 'core-js/features/observable';
import { activityMap } from '../../utils/helper';
import applySetStateMiddleware from '../../../applySetStateMiddleware';
import { compose } from 'redux';
import createThreadToDirectLineActivityMapper from './mappers/createThreadToDirectLineActivityMapper';
import createTypingMessageToDirectLineActivityMapper from './mappers/createTypingMessageToDirectLineActivityMapper';
import createUserMessageToDirectLineActivityMapper from './mappers/createUserMessageToDirectLineActivityMapper';

export default function createSubscribeNewMessageAndThreadUpdateEnhancer(): AdapterEnhancer<
  IC3DirectLineActivity,
  IC3AdapterState
> {
  return applySetStateMiddleware<IC3DirectLineActivity, IC3AdapterState>(({ getState, subscribe }) => {
    const convertMessage = compose(
      createUserMessageToDirectLineActivityMapper({ getState }),
      createTypingMessageToDirectLineActivityMapper({ getState })
    )(message => console.warn('IC3: Unknown type of message; ignoring message.', message));

    const convertThread = createThreadToDirectLineActivityMapper({ getState })(thread =>
      console.warn('IC3: Unknown type of thread; ignoring thread.', thread)
    );

    return next => (key: keyof IC3AdapterState, value: any) => {
      key === StateKey.Conversation &&
        subscribe(
          !!value &&
            new Observable<IC3DirectLineActivity>(subscriber => {
              const conversation = value as Microsoft.CRM.Omnichannel.IC3Client.Model.IConversation;
              const next = subscriber.next.bind(subscriber);

              // TODO: Currently, there is no way to unsubscribe. We are using this flag to fake an "unregisterOnXXX".
              let unsubscribed: boolean;

              (async function () {
                (await conversation.getMessages()).forEach(async message => {
                  console.log("get message from messages: ", message)
                  let activity = await convertMessage(message);
                  console.log("mapped to activity: ", activity);
                  !unsubscribed && next(activity);
                });

                conversation.registerOnNewMessage(async message => {
                  console.log("current state: ", getState(StateKey.Conversation));
                  console.log("register on new message: ", message);
                  let activity = await convertMessage(message);
                  if(activityMap.get(message.clientmessageid)){
                    activity = activityMap.get(message.clientmessageid);
                    activityMap.delete(message.clientmessageid);
                  }
                  else{
                    console.log("cannot find activity: ",message.clientmessageid );
                    console.log("activity map: dump: ", activityMap);
                  }
                  console.log("mapped to activity: ", activity);
                  !unsubscribed && next(activity);
                });

                conversation.registerOnThreadUpdate(async thread => {
                  console.log("got thread update notification: ", thread)
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
