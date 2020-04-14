/// <reference path="../types/external.d.ts" />

import Observable, { Observer, Subscription } from 'core-js/features/observable';

export default function shareObservable<T>(observable: Observable<T>): Observable<T> {
  const observers: Observer<T>[] = [];
  let subscription: Subscription;

  return new Observable((observer: Observer<T>) => {
    observers.push(observer);

    if (!subscription) {
      subscription = observable.subscribe({
        complete: () => observers.forEach(observer.complete.bind(observer)),
        error: () => observers.forEach(observer.error.bind(observer)),
        next: () => observers.forEach(observer.next.bind(observer))
      });
    }

    return () => {
      const observerIndex = observers.indexOf(observer);

      ~observerIndex && observers.splice(observerIndex, 1);
      !observers.length && subscription.unsubscribe();
    };
  });
}
