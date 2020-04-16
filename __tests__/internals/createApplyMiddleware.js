const { default: createAdapter, applyIngressMiddleware } = require('../../src/index');

const { compose } = require('redux');

test('passing a class object to enhancer should throw', async () => {
  class EnhancedAdapter {}

  expect(() =>
    createAdapter(
      {},
      compose(
        applyIngressMiddleware(() => next => activity => next(activity)),
        () => () => new EnhancedAdapter()
      )
    )
  ).toThrow('class object');
});
