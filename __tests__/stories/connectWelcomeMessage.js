/**
 * @jest-environment jsdom
 */

const asyncIterableToArray = require('../__jest__/asyncIterableToArray');

const { default: createAdapter } = require('../../src/createAdapter');
const { default: applyDispatchEventMiddleware } = require('../../src/applyDispatchEventMiddleware');

test('Connect will send welcome message', async () => {
  const adapter = createAdapter(
    {},
    applyDispatchEventMiddleware(({ ingress }) => next => event => {
      event.type === 'open' && ingress('welcome');
      next(event);
    })
  );

  const activities = adapter.activities();

  adapter.dispatchEvent(new Event('open'));
  adapter.close();

  await expect(asyncIterableToArray(activities)).resolves.toEqual(['welcome']);
});
