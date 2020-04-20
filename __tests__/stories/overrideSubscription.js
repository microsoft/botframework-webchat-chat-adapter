import asyncIterableToArray from '../__jest__/asyncIterableToArray';
import createAdapter, { applySubscribeMiddleware } from '../../src/index';
import Observable from 'core-js/features/observable';

test('override subscription', async () => {
  let override;
  let restore;

  const adapter = createAdapter(
    {},
    applySubscribeMiddleware(() => next => observable => {
      override = observable => next(observable);
      restore = () => next(observable);

      next(observable);
    })
  );

  const activities = adapter.activities();
  let index = 1;
  let subscribing;
  let subscribe = jest.fn(subscriber => {
    subscribing = true;
    subscriber.next(index++);
    subscriber.next(index++);

    return () => {
      subscribing = false;
    };
  });

  adapter.subscribe(new Observable(subscribe));

  expect(subscribe).toHaveBeenCalledTimes(1);
  expect(subscribing).toBe(true);

  override(Observable.from(['a', 'b', 'c']));

  expect(subscribing).toBe(false);

  restore();

  expect(subscribe).toHaveBeenCalledTimes(2);
  expect(subscribing).toBe(true);

  adapter.close();

  await expect(asyncIterableToArray(activities)).resolves.toEqual([1, 2, 'a', 'b', 'c', 3, 4]);
});
