const { default: AbortController } = require('abort-controller-es5');

const asyncIterableToArray = require('./__jest__/asyncIterableToArray');

const { default: createAdapter } = require('../src/createAdapter');

test('iterate 3 activities and end should complete gracefully', async () => {
  const adapter = createAdapter();
  const activityIterable = adapter.activities();

  adapter.ingress(1);
  adapter.ingress(2);
  adapter.ingress(3);
  adapter.end();

  await expect(asyncIterableToArray(activityIterable)).resolves.toEqual([1, 2, 3]);
});

test('iterate 1 activity and abort should throw "aborted" error', async () => {
  const adapter = createAdapter();
  const abortController = new AbortController();
  const activityIterable = adapter.activities({ signal: abortController.signal });

  adapter.ingress(1);

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
