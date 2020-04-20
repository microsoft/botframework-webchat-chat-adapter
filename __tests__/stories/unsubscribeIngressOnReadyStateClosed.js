import asyncIterableToArray from '../__jest__/asyncIterableToArray';
import createAdapter, { CLOSED } from '../../src/index';
import Observable from 'core-js/features/observable';

test('unsubscribe ingress when readyState become "CLOSED"', async () => {
  let setReadyState;

  const adapter = createAdapter({}, next => options => {
    const adapter = next(options);

    setReadyState = adapter.setReadyState;

    return adapter;
  });

  let subscribing;
  const activities = adapter.activities();

  adapter.subscribe(
    new Observable(subscriber => {
      subscribing = true;

      subscriber.next(1);
      subscriber.next(2);
      subscriber.next(3);

      return () => {
        subscribing = false;
      };
    })
  );

  expect(subscribing).toBe(true);

  await expect(asyncIterableToArray(activities, 3)).resolves.toEqual([1, 2, 3]);

  setReadyState(CLOSED);

  expect(subscribing).toBe(false);
});
