/// <reference path="../../types/ic3/external/Model.d.ts" />

import Observable, { Subscription } from 'core-js/features/observable';

import { ActivityMessageThread } from '../../types/ic3/ActivityMessageThread';
import { AdapterCreator, AdapterEnhancer } from '../../types/AdapterTypes';

import shareObservable from '../../utils/shareObservable';

type IC3AdapterOptions = {};

export default function createNewMessageEnhancer(
  conversation: Microsoft.CRM.Omnichannel.IC3Client.Model.IConversation
): AdapterEnhancer<ActivityMessageThread, IC3AdapterOptions> {
  return (next: AdapterCreator<ActivityMessageThread, IC3AdapterOptions>) => (options: IC3AdapterOptions) => {
    const adapter = next(options);
    const newMessageObservable = shareObservable<ActivityMessageThread>(
      new Observable(({ next }) => {
        (async function () {
          (await conversation.getMessages()).forEach(message => next({ message }));

          conversation.registerOnNewMessage((message: Microsoft.CRM.Omnichannel.IC3Client.Model.IMessage) =>
            next({ message })
          );
        })();
      })
    );

    let newMessageFirstSubscription: Subscription;

    adapter.subscribe(
      new Observable(({ complete, next, error }) => {
        if (!newMessageFirstSubscription) {
          newMessageObservable.subscribe({
            start(subscription: Subscription) {
              newMessageFirstSubscription = subscription;
            }
          });
        }

        let subscription: Subscription;

        newMessageObservable.subscribe({
          complete,
          error,
          next,
          start(thisSubscription: Subscription) {
            subscription = thisSubscription;
          }
        });

        return () => subscription.unsubscribe();
      })
    );

    return adapter;
  };
}
