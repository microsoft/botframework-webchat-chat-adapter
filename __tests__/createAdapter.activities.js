const { default: AbortController } = require('abort-controller-es5');

const asyncIterableToArray = require('./__jest__/asyncIterableToArray');

const { default: createAdapter } = require('../src/createAdapter');

test('iterate 3 activities and close should complete gracefully', async () => {
  const adapter = createAdapter();
  const activityIterable = adapter.activities();

  adapter.ingress(1);
  adapter.ingress(2);
  adapter.ingress(3);
  adapter.close();

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

test('iterate activities partially', async () => {
  const adapter = createAdapter();
  const abortController = new AbortController();
  const activityIterable1 = adapter.activities({ signal: abortController.signal });

  adapter.ingress(1);
  adapter.ingress(2);

  await expect(asyncIterableToArray(activityIterable1, 2)).resolves.toEqual([1, 2]);

  abortController.abort();

  const activityIterable2 = adapter.activities();

  adapter.ingress(3);
  adapter.ingress(4);
  adapter.ingress(5);
  adapter.close();

  await expect(asyncIterableToArray(activityIterable2)).resolves.toEqual([3, 4, 5]);
});

test('2 iterations at the same time', async () => {
  const adapter = createAdapter();
  const activityIterable1 = adapter.activities();
  const activityIterable2 = adapter.activities();

  adapter.ingress(1);
  adapter.ingress(2);
  adapter.ingress(3);
  adapter.close();

  await expect(asyncIterableToArray(activityIterable1)).resolves.toEqual([1, 2, 3]);
  await expect(asyncIterableToArray(activityIterable2)).resolves.toEqual([1, 2, 3]);
});
