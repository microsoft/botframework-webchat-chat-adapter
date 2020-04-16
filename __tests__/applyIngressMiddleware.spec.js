const asyncIterableToArray = require('./__jest__/asyncIterableToArray');

const { default: createAdapter } = require('../src/createAdapter');
const { default: applyIngressMiddleware } = require('../src/applyIngressMiddleware');

test('no middleware', async () => {
  const adapter = createAdapter({}, applyIngressMiddleware());

  const activityIterable = adapter.activities();

  adapter.ingress(1);
  adapter.close();

  await expect(asyncIterableToArray(activityIterable)).resolves.toEqual([1]);
});

test('1 sync middleware for augmentation', async () => {
  const adapter = createAdapter(
    {},
    applyIngressMiddleware(() => next => activity => {
      next(activity * 10);
      adapter.close();
    })
  );

  const activityIterable = adapter.activities();

  adapter.ingress(1);

  await expect(asyncIterableToArray(activityIterable)).resolves.toEqual([10]);
});

test('1 async middleware for augmentation', async () => {
  const adapter = createAdapter(
    {},
    applyIngressMiddleware(() => next => activity => {
      setImmediate(() => {
        next(activity * 10);
        adapter.close();
      });
    })
  );

  const activityIterable = adapter.activities();

  adapter.ingress(1);

  await expect(asyncIterableToArray(activityIterable)).resolves.toEqual([10]);
});

test('1 sync middleware to emit 2 activities', async () => {
  const adapter = createAdapter(
    {},
    applyIngressMiddleware(({ ingress }) => next => activity => {
      next(activity * 10);
      next(activity * 100);

      adapter.close();
    })
  );

  const activityIterable = adapter.activities();

  adapter.ingress(1);

  await expect(asyncIterableToArray(activityIterable)).resolves.toEqual([10, 100]);
});

test('1 async middleware to emit 2 activities', async () => {
  const adapter = createAdapter(
    {},
    applyIngressMiddleware(({ ingress }) => next => activity => {
      next(activity * 10);

      setImmediate(() => {
        next(activity * 100);

        adapter.close();
      });
    })
  );

  const activityIterable = adapter.activities();

  adapter.ingress(1);

  await expect(asyncIterableToArray(activityIterable)).resolves.toEqual([10, 100]);
});

test('middleware to filter out certain activities', async () => {
  const adapter = createAdapter(
    {},
    applyIngressMiddleware(() => next => activity => {
      activity % 2 && next(activity);
    })
  );

  const activityIterable = adapter.activities();

  adapter.ingress(1);
  adapter.ingress(2);
  adapter.ingress(3);
  adapter.close();

  await expect(asyncIterableToArray(activityIterable)).resolves.toEqual([1, 3]);
});

test('2 sync middleware', async () => {
  const adapter = createAdapter(
    {},
    applyIngressMiddleware(
      () => next => activity => {
        next(activity + 1);
      },
      () => next => activity => {
        next(activity * 10);
      }
    )
  );

  const activityIterable = adapter.activities();

  adapter.ingress(1);
  adapter.close();

  await expect(asyncIterableToArray(activityIterable)).resolves.toEqual([20]);
});

test('2 async middleware', async () => {
  const adapter = createAdapter(
    {},
    applyIngressMiddleware(
      () => next => activity => {
        setImmediate(() => next(activity + 1));
      },
      () => next => activity => {
        setImmediate(() => {
          next(activity * 10);
          adapter.close();
        });
      }
    )
  );

  const activityIterable = adapter.activities();

  adapter.ingress(1);

  await expect(asyncIterableToArray(activityIterable)).resolves.toEqual([20]);
});

test('2 middleware with latter emitting activity to former', async () => {
  const adapter = createAdapter(
    {},
    applyIngressMiddleware(
      () => next => activity => {
        next(activity + 100);
      },
      ({ ingress }) => next => activity => {
        next(activity);

        // Calling ingress() will put an activity to the ingress queue and run through the whole middleware chain from start.
        activity % 2 && ingress(activity + 1);
      }
    )
  );

  const activityIterable = adapter.activities();

  adapter.ingress(1);
  adapter.close();

  await expect(asyncIterableToArray(activityIterable)).resolves.toEqual([101, 202]);
});

test('calling API too early should throw', async () => {
  expect(() =>
    createAdapter(
      {},
      applyIngressMiddleware(({ ingress }) => {
        ingress();

        return next => activity => {
          next(activity + 100);
        };
      })
    )
  ).toThrow('while constructing');
});
