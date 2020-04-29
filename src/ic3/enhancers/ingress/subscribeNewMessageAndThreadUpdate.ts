/// <reference path="../../../types/ic3/external/Model.d.ts" />

import { compose } from 'redux';
import Observable from 'core-js/features/observable';

import { AdapterEnhancer } from '../../../types/AdapterTypes';
import { IC3AdapterState, StateKey } from '../../../types/ic3/IC3AdapterState';
import { IC3DirectLineActivity } from '../../../types/ic3/IC3DirectLineActivity';
import applySetStateMiddleware from '../../../applySetStateMiddleware';
import createThreadToDirectLineActivityMapper from './mappers/createThreadToDirectLineActivityMapper';
import createTypingMessageToDirectLineActivityMapper from './mappers/createTypingMessageToDirectLineActivityMapper';
import createUserMessageToDirectLineActivityMapper from './mappers/createUserMessageToDirectLineActivityMapper';

export default function createSubscribeNewMessageAndThreadUpdateEnhancer(): AdapterEnhancer<
  IC3DirectLineActivity,
  IC3AdapterState
> {
  return applySetStateMiddleware<IC3DirectLineActivity, IC3AdapterState>(
    ({ getState, subscribe }) => next => (key: keyof IC3AdapterState, value: any) => {
      if (key === StateKey.Conversation && value) {
        const conversation = value as Microsoft.CRM.Omnichannel.IC3Client.Model.IConversation;

        subscribe(
          new Observable<IC3DirectLineActivity>(subscriber => {
            let unsubscribed: boolean;
            const next = subscriber.next.bind(subscriber);

            const convertMessage = compose(
              createUserMessageToDirectLineActivityMapper({ getState }),
              createTypingMessageToDirectLineActivityMapper({ getState })
            )(message => {
              console.warn('IC3: Unknown type of message; ignoring message.', message);
            });

            const convertThread = createThreadToDirectLineActivityMapper({ getState })(thread => {
              console.warn('IC3: Unknown type of thread; ignoring thread.', thread);
            });

            (async function () {
              (await conversation.getMessages()).forEach(async message => {
                !unsubscribed && next(await convertMessage(message));
              });

              conversation.registerOnNewMessage(async message => {
                !unsubscribed && next(await convertMessage(message));
              });

              conversation.registerOnThreadUpdate(async thread => {
                !unsubscribed && next(await convertThread(thread));
              });
            })();

            return () => {
              unsubscribed = true;
            };
          })
        );
      }

      return next(key, value);
    }
  );
}
