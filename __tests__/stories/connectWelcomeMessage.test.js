import asyncIterableToArray from '../__jest__/asyncIterableToArray';

import createAdapter, { OPEN } from '../../src/index';

test('Send welcome message on "open" event', async () => {
  let setReadyState;
  const adapter = createAdapter({}, next => options => {
    const adapter = next(options);

    setReadyState = adapter.setReadyState;

    adapter.addEventListener('open', () => adapter.ingress('welcome'));

    return adapter;
  });

  const activities = adapter.activities();

  setReadyState(OPEN);
  adapter.close();

  await expect(asyncIterableToArray(activities)).resolves.toEqual(['welcome']);
});
