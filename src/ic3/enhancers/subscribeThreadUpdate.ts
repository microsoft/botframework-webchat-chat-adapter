/// <reference path="../../types/ic3/external/Model.d.ts" />

import Observable, { Subscription } from 'core-js/features/observable';

import { ActivityMessageThread } from '../../types/ic3/ActivityMessageThread';
import { AdapterCreator, AdapterEnhancer } from '../../types/AdapterTypes';
import shareObservable from '../../utils/shareObservable';

type IC3AdapterOptions = {};

export default function createThreadUpdateEnhancer(
  conversation: Microsoft.CRM.Omnichannel.IC3Client.Model.IConversation
): AdapterEnhancer<ActivityMessageThread, IC3AdapterOptions> {
  return (next: AdapterCreator<ActivityMessageThread, IC3AdapterOptions>) => (options: IC3AdapterOptions) => {
    const adapter = next(options);

    const threadUpdateObservable = shareObservable<ActivityMessageThread>(
      new Observable(({ next }) => {
        const handleThreadUpdate = (thread: Microsoft.CRM.Omnichannel.IC3Client.Model.IThread) => next({ thread });

        conversation.registerOnThreadUpdate(handleThreadUpdate);
      })
    );

    let threadUpdateFirstSubscription: Subscription;

    adapter.subscribe(
      new Observable(({ complete, next, error }) => {
        if (!threadUpdateFirstSubscription) {
          threadUpdateObservable.subscribe({
            start(subscription: Subscription) {
              threadUpdateFirstSubscription = subscription;
            }
          });
        }

        let subscription: Subscription;

        threadUpdateObservable.subscribe({
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
