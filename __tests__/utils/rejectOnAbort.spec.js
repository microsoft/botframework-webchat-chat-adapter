import AbortController from 'abort-controller';
import hasResolved from 'has-resolved';

import rejectOnAbort from '../../src/utils/rejectOnAbort';

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
