const createDeferred = require('p-defer');
const Observable = require('core-js/features/observable');

const { default: applyIncomingActivityMiddleware } = require('../src/applyIngressActivityMiddleware');
const { default: createIC3Adapter } = require('../src/createChatAdapter');

test('basic without any middleware', async () => {
  let mockActivityObserver;
  const mockActivity$ = new Observable(observer => {
    mockActivityObserver = observer;

    return () => {};
  });

  const adapter = createIC3Adapter({ mockActivity$ });
  const waitableActivities = waitableObservable(adapter.activity$);

  // Wait for 1 to return as 1.
  // We are using Promise.all because the expectation need to be set up before we call next(). Otherwise, the expectation will miss the next() call.
  await Promise.all([waitableActivities.next(1), mockActivityObserver.next(1)]);
  await Promise.all([waitableActivities.complete(), mockActivityObserver.complete()]);

  expect(waitableActivities.values()).toEqual([1]);
});

test('with a single sync middleware', async () => {
  let mockActivityObserver;
  const mockActivity$ = new Observable(observer => {
    mockActivityObserver = observer;

    return () => {};
  });

  const adapter = createIC3Adapter(
    { mockActivity$ },
    applyIncomingActivityMiddleware(() => next => activity => next(activity * 10))
  );

  const waitableActivities = waitableObservable(adapter.activity$);

  // Wait for 1 to return as 10.
  // We are using Promise.all because the expectation need to be set up before we call next(). Otherwise, the expectation will miss the next() call.
  await Promise.all([waitableActivities.next(10), mockActivityObserver.next(1)]);
  await Promise.all([waitableActivities.complete(), mockActivityObserver.complete()]);

  expect(waitableActivities.values()).toEqual([10]);
});

test('with a single async middleware', async () => {
  let mockActivityObserver;
  const mockActivity$ = new Observable(observer => {
    mockActivityObserver = observer;

    return () => {};
  });

  const adapter = createIC3Adapter(
    { mockActivity$ },
    applyIncomingActivityMiddleware(() => next => activity => setImmediate(() => next(activity * 10)))
  );

  const waitableActivities = waitableObservable(adapter.activity$);

  // Wait for 1 to return as 10.
  // We are using Promise.all because the expectation need to be set up before we call next(). Otherwise, the expectation will miss the next() call.
  await Promise.all([waitableActivities.next(10), mockActivityObserver.next(1)]);
  await Promise.all([waitableActivities.complete(), mockActivityObserver.complete()]);

  expect(waitableActivities.values()).toEqual([10]);
});

function waitableObservable(observable) {
  const completeDeferred = createDeferred();
  const errorDeferred = createDeferred();
  let nextDeferreds = [];
  const values = [];
  const subscription = observable.subscribe({
    complete: completeDeferred.resolve,
    error: errorDeferred.resolve,
    next: value => {
      nextDeferreds = nextDeferreds.reduce((nextDeferreds, deferred) => {
        if (deferred.predicate(value)) {
          deferred.resolve();

          return nextDeferreds;
        }

        return [...nextDeferreds, deferred];
      }, []);

      values.push(value);
    }
  });

  return {
    complete: () => completeDeferred.promise,
    error: () => errorDeferred.promise,
    next: predicateOrValue => {
      const deferred = createDeferred();

      nextDeferreds.push({
        ...deferred,
        predicate:
          typeof predicateOrValue === 'function' ? predicateOrValue : value => Object.is(predicateOrValue, value),
        predicateOrValue
      });

      return deferred.promise;
    },
    unsubscribe: () => subscription.unsubscribe(),
    values: () => values
  };
}
