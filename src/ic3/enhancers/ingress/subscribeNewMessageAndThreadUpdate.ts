/// <reference path="../../../types/ic3/external/Model.d.ts" />

import Observable from 'core-js/features/observable';

import { ActivityMessageThread } from '../../../types/ic3/ActivityMessageThread';
import { AdapterConfigValue, AdapterEnhancer } from '../../../types/AdapterTypes';
import { IC3AdapterState, StateKey } from '../../../types/ic3/IC3AdapterState';
import applySetConfigMiddleware from '../../../applySetConfigMiddleware';

export default function createSubscribeNewMessageAndThreadUpdateEnhancer(): AdapterEnhancer<
  ActivityMessageThread,
  ActivityMessageThread,
  IC3AdapterState
> {
  return applySetConfigMiddleware(
    ({ subscribe }) => next => (key: keyof IC3AdapterState, value: AdapterConfigValue) => {
      if (key === StateKey.Conversation && value) {
        const conversation = value as Microsoft.CRM.Omnichannel.IC3Client.Model.IConversation;

        subscribe(
          new Observable<ActivityMessageThread>(({ next }) => {
            let unsubscribed: boolean;

            (async function () {
              (await conversation.getMessages()).forEach(message => {
                !unsubscribed && next({ message });
              });

              conversation.registerOnNewMessage((message: Microsoft.CRM.Omnichannel.IC3Client.Model.IMessage) => {
                !unsubscribed && next({ message });
              });

              conversation.registerOnThreadUpdate((thread: Microsoft.CRM.Omnichannel.IC3Client.Model.IThread) => {
                !unsubscribed && next({ thread });
              });
            })().catch(err => console.error(err));

            return () => {
              unsubscribed = true;
            };
          })
        );
      }

      return next(key, value);
    }
  );
  // return (next: AdapterCreator<ActivityMessageThread, IC3AdapterOptions>) => (options: IC3AdapterOptions) => {
  //   const adapter = next(options);
  //   const newMessageObservable = shareObservable<ActivityMessageThread>(
  //     new Observable(({ next }) => {
  //       (async function () {
  //         (await conversation.getMessages()).forEach(message => next({ message }));

  //         conversation.registerOnNewMessage((message: Microsoft.CRM.Omnichannel.IC3Client.Model.IMessage) =>
  //           next({ message })
  //         );
  //       })();
  //     })
  //   );

  //   let newMessageFirstSubscription: Subscription;

  //   adapter.subscribe(
  //     new Observable(({ complete, next, error }) => {
  //       if (!newMessageFirstSubscription) {
  //         newMessageObservable.subscribe({
  //           start(subscription: Subscription) {
  //             newMessageFirstSubscription = subscription;
  //           }
  //         });
  //       }

  //       let subscription: Subscription;

  //       newMessageObservable.subscribe({
  //         complete,
  //         error,
  //         next,
  //         start(thisSubscription: Subscription) {
  //           subscription = thisSubscription;
  //         }
  //       });

  //       return () => subscription.unsubscribe();
  //     })
  //   );

  //   return adapter;
  // };
}
