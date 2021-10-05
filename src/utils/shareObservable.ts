/// <reference path="../types/external.d.ts" />

import Observable, { Observer, Subscription } from 'core-js/features/observable';

import { TelemetryEvents } from '../types/ic3/TelemetryEvents';

export default function shareObservable<T>(observable: Observable<T>, caller?: string, logger?: any): Observable<T> {
  let observers: Observer<T>[] = [];
  let subscription: Subscription;
  logger?.logClientSdkTelemetryEvent(Microsoft.CRM.Omnichannel.IC3Client.Model.LogLevel.DEBUG,
    {
      Event: TelemetryEvents.SHARE_OBSERVABLE_EVENT,
      Description: `Adapter: calling creating new shareObservable by: ${caller}`
    }
  );
  let newObservableFunction = (observer: Observer<T>) => {
    logger?.logClientSdkTelemetryEvent(Microsoft.CRM.Omnichannel.IC3Client.Model.LogLevel.DEBUG,
      {
        Event: TelemetryEvents.SHARE_OBSERVABLE_EVENT,
        Description: `Adapter: new oberver subscribed ${observer}`
      }
    );
    observers = [...observers, observer];
    if (!subscription) {
      logger?.logClientSdkTelemetryEvent(Microsoft.CRM.Omnichannel.IC3Client.Model.LogLevel.DEBUG,
        {
          Event: TelemetryEvents.SHARE_OBSERVABLE_EVENT,
          Description: `Adapter: creating new subscription`
        }
      );
      subscription = observable.subscribe({
        complete: () => observers.forEach(observer => observer.complete()),
        error: (error: Error) => observers.forEach(observer => observer.error(error)),
        next: (value: T) => observers.forEach(observer => observer.next(value))
      });
    }

    return () => {
      observers = observers.filter(o => o !== observer);
      if (!observers.length) {
        logger?.logClientSdkTelemetryEvent(Microsoft.CRM.Omnichannel.IC3Client.Model.LogLevel.DEBUG,
          {
            Event: TelemetryEvents.SHARE_OBSERVABLE_EVENT,
            Description: `Adapter: subscription unsubscribed`
          }
        );
        subscription.unsubscribe();
        subscription = undefined;
      }
    };
  }
  return new Observable(newObservableFunction);
}
