import { compose } from 'redux';
import Observable from 'core-js/features/observable';
import { IObserver } from './types/ObservableTypes';

import { IActivity } from './types/DirectLineTypes';
import { AdapterEnhancer, AdapterAPI } from './types/ChatAdapterTypes';

type IngressActivityUpdater = (activity: IActivity) => IActivity;
type IngressActivityMiddleware = (
  adapterAPI: AdapterAPI
) => (next: IngressActivityUpdater) => IngressActivityUpdater;

// This will convert multiple middlewares into a single enhancer.
// Enhancer is another middleware for the constructor of adapter. Essentially HOC for adapter.
// We can chain multiple enhancer together, and plug-in multiple features to a single adapter.
// In the future, if we decided to change Adapter, middleware written by user can still be reused. We won't introduce breaking changes.
export default function applyIngressActivityMiddleware(...middlewares: IngressActivityMiddleware[]): AdapterEnhancer {
  return nextEnhancer => options => {
    const adapter = nextEnhancer(options);
    const chain = middlewares.map(middleware => middleware({ postActivity: adapter.postActivity }));

    return {
      ...adapter,

      // The core part of the applyIngressActivityMiddleware is to create a new adapter with a patched activity$.
      // The patched activity$ works almost like the original one, except, the content is filtered through a series of middleware.
      activity$: new Observable((observer: IObserver<IActivity>) => {
        const next = compose<typeof observer.next>(...chain)((activity: IActivity) => observer.next(activity));

        const subscription = adapter.activity$.subscribe({
          complete: () => observer.complete(),
          error: (err: Error) => observer.error(err),
          next: (activity: IActivity) => next(activity)
        });

        return () => subscription.unsubscribe();
      })
    };
  };
}
