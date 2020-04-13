const asyncIterableToArray = require('./__jest__/asyncIterableToArray');

const { default: createChatAdapter } = require('../src/createChatAdapter');
const { default: applyIngressActivityMiddleware } = require('../src/applyIngressActivityMiddleware');

test('no middleware', async () => {
  const adapter = createChatAdapter({}, applyIngressActivityMiddleware());

  const activityIterable = adapter.activities();

  adapter.ingressActivity(1);
  adapter.end();

  await expect(asyncIterableToArray(activityIterable)).resolves.toEqual([1]);
});

test('1 sync middleware for augmentation', async () => {
  const adapter = createChatAdapter(
    {},
    applyIngressActivityMiddleware(() => next => activity => {
      next(activity * 10);
      adapter.end();
    })
  );

  const activityIterable = adapter.activities();

  adapter.ingressActivity(1);

  await expect(asyncIterableToArray(activityIterable)).resolves.toEqual([10]);
});

test('1 async middleware for augmentation', async () => {
  const adapter = createChatAdapter(
    {},
    applyIngressActivityMiddleware(() => next => activity => {
      setImmediate(() => {
        next(activity * 10);
        adapter.end();
      });
    })
  );

  const activityIterable = adapter.activities();

  adapter.ingressActivity(1);

  await expect(asyncIterableToArray(activityIterable)).resolves.toEqual([10]);
});

test('1 sync middleware to emit 2 activities', async () => {
  const adapter = createChatAdapter(
    {},
    applyIngressActivityMiddleware(({ ingressActivity }) => next => activity => {
      next(activity * 10);
      ingressActivity(activity * 100);
      adapter.end();
    })
  );

  const activityIterable = adapter.activities();

  adapter.ingressActivity(1);

  await expect(asyncIterableToArray(activityIterable)).resolves.toEqual([10, 100]);
});

test('1 async middleware to emit 2 activities', async () => {
  const adapter = createChatAdapter(
    {},
    applyIngressActivityMiddleware(({ ingressActivity }) => next => activity => {
      next(activity * 10);

      setImmediate(() => {
        ingressActivity(activity * 100);
        adapter.end();
      });
    })
  );

  const activityIterable = adapter.activities();

  adapter.ingressActivity(1);

  await expect(asyncIterableToArray(activityIterable)).resolves.toEqual([10, 100]);
});

test('middleware to filter out certain activities', async () => {
  const adapter = createChatAdapter(
    {},
    applyIngressActivityMiddleware(() => next => activity => {
      activity % 2 && next(activity);
    })
  );

  const activityIterable = adapter.activities();

  adapter.ingressActivity(1);
  adapter.ingressActivity(2);
  adapter.ingressActivity(3);
  adapter.end();

  await expect(asyncIterableToArray(activityIterable)).resolves.toEqual([1, 3]);
});

test('2 sync middleware', async () => {
  const adapter = createChatAdapter(
    {},
    applyIngressActivityMiddleware(
      () => next => activity => {
        next(activity + 1);
      },
      () => next => activity => {
        next(activity * 10);
      }
    )
  );

  const activityIterable = adapter.activities();

  adapter.ingressActivity(1);
  adapter.end();

  await expect(asyncIterableToArray(activityIterable)).resolves.toEqual([20]);
});

test('2 async middleware', async () => {
  const adapter = createChatAdapter(
    {},
    applyIngressActivityMiddleware(
      () => next => activity => {
        setImmediate(() => next(activity + 1));
      },
      () => next => activity => {
        setImmediate(() => {
          next(activity * 10);
          adapter.end();
        });
      }
    )
  );

  const activityIterable = adapter.activities();

  adapter.ingressActivity(1);

  await expect(asyncIterableToArray(activityIterable)).resolves.toEqual([20]);
});

test('2 middleware with latter emitting activity to former', async () => {
  const adapter = createChatAdapter(
    {},
    applyIngressActivityMiddleware(
      () => next => activity => {
        next(activity + 100);
      },
      ({ ingressActivity }) => next => activity => {
        next(activity);

        // Calling ingressActivity() will put an activity to the ingress queue and run through the whole middleware chain from start.
        activity % 2 && ingressActivity(activity + 1);
      }
    )
  );

  const activityIterable = adapter.activities();

  adapter.ingressActivity(1);
  adapter.end();

  await expect(asyncIterableToArray(activityIterable)).resolves.toEqual([101, 102]);
});
