const { compose } = require('redux');

const { default: createAdapter, applyIngressMiddleware, CONNECTING, OPEN } = require('../../src/index');

test('ingress to signal online', async () => {
  const adapter = createAdapter(
    {},
    compose(
      applyIngressMiddleware(({ setReadyState }) => next => activity => {
        setReadyState(OPEN);

        return next(activity);
      })
    )
  );

  expect(adapter.readyState).toBe(CONNECTING);

  adapter.ingress(1);

  expect(adapter.readyState).toBe(OPEN);
});
