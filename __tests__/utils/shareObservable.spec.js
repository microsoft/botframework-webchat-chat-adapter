import createDeferred from 'p-defer-es5';
import Observable from 'core-js/features/observable';

import observableToArray from '../__jest__/observableToArray';

import shareObservable from '../../src/utils/shareObservable';

test('2 observables at the same time', async () => {
  const { promise, resolve } = createDeferred();
  const unsubscribe = jest.fn();

  const observerCallback = jest.fn(observer => {
    (async function () {
      await promise;

      observer.next(1);
      observer.next(2);
      observer.next(3);
      observer.complete();
    })();

    return unsubscribe;
  });

  const observable = new Observable(observerCallback);
  const sharedObservable = shareObservable(observable);

  expect(observerCallback).toHaveBeenCalledTimes(0);

  const array1Promise = observableToArray(sharedObservable);

  expect(observerCallback).toHaveBeenCalledTimes(1);

  const array2Promise = observableToArray(sharedObservable);

  expect(observerCallback).toHaveBeenCalledTimes(1);

  expect(unsubscribe).toHaveBeenCalledTimes(0);

  resolve();

  await expect(array1Promise).resolves.toEqual([1, 2, 3]);
  await expect(array2Promise).resolves.toEqual([1, 2, 3]);

  expect(unsubscribe).toHaveBeenCalledTimes(1);
});

test('2 observables and error out', async () => {
  const { promise, resolve } = createDeferred();
  const unsubscribe = jest.fn();

  const observerCallback = jest.fn(observer => {
    (async function () {
      await promise;

      observer.next(1);
      observer.error(new Error('artificial'));
    })();

    return unsubscribe;
  });

  const observable = new Observable(observerCallback);
  const sharedObservable = shareObservable(observable);

  const array1Promise = observableToArray(sharedObservable);
  const array2Promise = observableToArray(sharedObservable);

  expect(unsubscribe).toHaveBeenCalledTimes(0);

  resolve();

  await expect(array1Promise).rejects.toThrow('artificial');
  await expect(array2Promise).rejects.toThrow('artificial');

  expect(unsubscribe).toHaveBeenCalledTimes(1);
});

test('2 observables at different time', async () => {
  const { promise: promise1, resolve: resolve1 } = createDeferred();
  const { promise: promise2, resolve: resolve2 } = createDeferred();
  const unsubscribe = jest.fn();

  const observerCallback = jest.fn(observer => {
    (async function () {
      await promise1;

      observer.next(1);
      observer.next(2);

      await promise2;

      observer.next(3);
      observer.next(4);
      observer.complete();
    })();

    return unsubscribe;
  });

  const observable = new Observable(observerCallback);
  const sharedObservable = shareObservable(observable);

  // We are only getting first 2 items from the observable.
  const array1Promise = observableToArray(sharedObservable, { count: 2 });

  expect(unsubscribe).toHaveBeenCalledTimes(0);

  resolve1();

  await expect(array1Promise).resolves.toEqual([1, 2]);

  expect(unsubscribe).toHaveBeenCalledTimes(1);
  expect(observerCallback).toHaveBeenCalledTimes(1);

  const array2Promise = observableToArray(sharedObservable);

  expect(observerCallback).toHaveBeenCalledTimes(2);
  resolve2();

  // Since it is already unsubscribed, it should restart from beginning.
  await expect(array2Promise).resolves.toEqual([1, 2, 3, 4]);

  expect(unsubscribe).toHaveBeenCalledTimes(2);
});
