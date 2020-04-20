import asyncIterableToArray from '../__jest__/asyncIterableToArray';
import createAdapter, { applyIngressMiddleware } from '../../src/index';
import Observable from 'core-js/features/observable';

test('modify ingress activities from subscription', async () => {
  const adapter = createAdapter(
    {},
    applyIngressMiddleware(() => next => activity => next(activity * 10))
  );

  const activities = adapter.activities();

  adapter.subscribe(
    new Observable(subscriber => {
      subscriber.next(1);
      subscriber.next(2);
      subscriber.next(3);

      adapter.close();
    })
  );

  await expect(asyncIterableToArray(activities)).resolves.toEqual([10, 20, 30]);
});
