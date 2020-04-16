/**
 * @jest-environment jsdom
 */

const asyncIterableToArray = require('../__jest__/asyncIterableToArray');
const { compose } = require('redux');

const { default: createAdapter, applySetReadyStateMiddleware, OPEN } = require('../../src/index');

test('Connect will send welcome message', async () => {
  let setReadyState;
  const adapter = createAdapter(
    {},
    compose(
      applySetReadyStateMiddleware(({ ingress, setReadyState: setReadyStateAPI }) => {
        setReadyState = setReadyStateAPI;

        return next => {
          return readyState => {
            readyState === OPEN && ingress('welcome');
            next(readyState);
          };
        };
      }),
      applySetReadyStateMiddleware(({ setReadyState: setReadyStateAPI }) => {
        // setReadyState = setReadyStateAPI;

        return next => readyState => next(readyState);
      })
    )
  );

  const activities = adapter.activities();

  setReadyState(OPEN);
  adapter.close();

  await expect(asyncIterableToArray(activities)).resolves.toEqual(['welcome']);
});
