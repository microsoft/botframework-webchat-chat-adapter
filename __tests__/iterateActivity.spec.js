const { default: AbortController } = require('abort-controller-es5');

const asyncIterableToArray = require('./__jest__/asyncIterableToArray');

const { default: createChatAdapter } = require('../src/createChatAdapter');

test('iterate 3 activities and end should complete gracefully', async () => {
  const adapter = createChatAdapter();
  const activityIterable = adapter.activities();

  adapter.ingressActivity(1);
  adapter.ingressActivity(2);
  adapter.ingressActivity(3);
  adapter.end();

  await expect(asyncIterableToArray(activityIterable)).resolves.toEqual([1, 2, 3]);
});

test('iterate 1 activity and abort should throw "aborted" error', async () => {
  const adapter = createChatAdapter();
  const abortController = new AbortController();
  const activityIterable = adapter.activities({ signal: abortController.signal });

  adapter.ingressActivity(1);

  const results = [];

  await expect(
    (async () => {
      for await (const activity of activityIterable) {
        results.push(activity);

        abortController.abort();
      }
    })()
  ).rejects.toThrow('aborted');

  expect(results).toEqual([1]);
});
