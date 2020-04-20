import { compose } from 'redux';

import createAdapter, { applyIngressMiddleware } from '../../src/index';

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
