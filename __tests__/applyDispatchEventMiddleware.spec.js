/**
 * @jest-environment jsdom
 */

const { default: createAdapter } = require('../src/createAdapter');
const { default: applyDispatchEventMiddleware } = require('../src/applyDispatchEventMiddleware');

test('1 async middleware', async () => {
  const openEvent = new Event('open');
  let emitOpen;

  const adapter = createAdapter(
    {},
    applyDispatchEventMiddleware(({ dispatchEvent }) => {
      emitOpen = () => dispatchEvent(openEvent);

      return next => event => next(event);
    })
  );

  const openListener = jest.fn();

  adapter.addEventListener('open', openListener);

  expect(openListener).toHaveBeenCalledTimes(0);

  emitOpen();

  expect(openListener).toHaveBeenCalledTimes(1);
  expect(openListener).toHaveBeenCalledWith(openEvent);
});
