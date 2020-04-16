const { default: AbortController } = require('abort-controller');
const { default: hasResolved } = require('has-resolved');

const { default: rejectOnAbort } = require('../../src/utils/rejectOnAbort');

test('abort after start', async () => {
  const abortController = new AbortController();
  const aborted = rejectOnAbort(abortController.signal);

  await expect(hasResolved(aborted)).resolves.toBe(false);

  abortController.abort();

  await expect(aborted).rejects.toThrow('aborted');
});

test('abort before start', async () => {
  const abortController = new AbortController();

  abortController.abort();

  const aborted = rejectOnAbort(abortController.signal);

  await expect(aborted).rejects.toThrow('aborted');
});
