const asyncIterableToArray = require('../__jest__/asyncIterableToArray');

const { default: createAdapter, OPEN } = require('../../src/index');

test('Connect will send welcome message', async () => {
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
