/// <reference path="../types/external.d.ts" />

import Observable, { Observer, Subscription } from 'core-js/features/observable';

export default function shareObservable<T>(observable: Observable<T>): Observable<T> {
  const observers: Observer<T>[] = [];
  let subscription: Subscription;

  return new Observable((observer: Observer<T>) => {
    observers.push(observer);

    if (!subscription) {
      subscription = observable.subscribe({
        complete: () => [...observers].forEach(observer => observer.complete()),
        error: (error: Error) => [...observers].forEach(observer => observer.error(error)),
        next: (value: T) => [...observers].forEach(observer => observer.next(value))
      });
    }

    return () => {
      const observerIndex = observers.indexOf(observer);

      ~observerIndex && observers.splice(observerIndex, 1);

      if (!observers.length) {
        subscription.unsubscribe();
        subscription = undefined;
      }
    };
  });
}
