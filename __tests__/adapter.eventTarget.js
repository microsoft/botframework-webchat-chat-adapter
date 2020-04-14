/**
 * @jest-environment jsdom
 */

const { default: createAdapter } = require('../src/createAdapter');

test('dispatchEvent should call addEventListener', async () => {
  const adapter = createAdapter();

  const open = jest.fn();

  adapter.addEventListener('open', open);

  const openEvent = new Event('open');

  adapter.dispatchEvent(openEvent);

  expect(open).toHaveBeenCalledTimes(1);
  expect(open).toHaveBeenCalledWith(openEvent);
});
