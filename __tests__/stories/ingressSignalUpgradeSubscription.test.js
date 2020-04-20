import asyncIterableToArray from '../__jest__/asyncIterableToArray';
import createAdapter, { applyIngressMiddleware } from '../../src/index';

test('ingress can signal to upgrade subscription', async () => {
  const unsubscribe = jest.fn();

  const subscribe1 = jest.fn(subscriber => {
    subscriber.next(1);
    subscriber.next(2); // This will trigger a subscription change.
    subscriber.next(3);
    subscriber.error(new Error('Reached unreachable code')); // This should be ignored because we have already unsubscribed.

    return unsubscribe;
  });

  const subscribe2 = jest.fn(subscriber => {
    subscriber.next('a');
    subscriber.next('b');
  });

  const adapter = createAdapter(
    {},
    applyIngressMiddleware(({ subscribe }) => next => activity => {
      next(activity);

      activity === 2 && subscribe(new Observable(subscribe2));
    })
  );

  const activities = adapter.activities();

  adapter.subscribe(new Observable(subscribe1));
  adapter.close();

  await expect(asyncIterableToArray(activities)).resolves.toEqual([1, 2, 'a', 'b']);

  expect(subscribe1).toHaveBeenCalledTimes(1);
  expect(subscribe2).toHaveBeenCalledTimes(1);
  expect(unsubscribe).toHaveBeenCalledTimes(1);
});
