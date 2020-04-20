import asyncIterableToArray from '../__jest__/asyncIterableToArray';
import createAdapter from '../../src/index';
import Observable from 'core-js/features/observable';

test('override subscription', async () => {
  const adapter = createAdapter();

  const activities = adapter.activities();
  let index = 1;
  let subscribing;

  const subscribe = jest.fn(subscriber => {
    subscribing = true;
    subscriber.next(index++);
    subscriber.next(index++);

    return () => {
      subscribing = false;
    };
  });

  const observable = new Observable(subscribe);

  adapter.subscribe(observable);

  expect(subscribe).toHaveBeenCalledTimes(1);
  expect(subscribing).toBe(true);

  adapter.subscribe(false);

  expect(subscribing).toBe(false);

  adapter.subscribe(observable);

  expect(subscribe).toHaveBeenCalledTimes(2);
  expect(subscribing).toBe(true);

  adapter.close();

  await expect(asyncIterableToArray(activities)).resolves.toEqual([1, 2, 3, 4]);
});
