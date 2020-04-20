import Observable from 'core-js/features/observable';

import createAdapter, { applyIngressMiddleware, CONNECTING, OPEN } from '../../src/index';

test('ingress to signal online', async () => {
  const adapter = createAdapter(
    {},
    applyIngressMiddleware(({ setReadyState }) => next => activity => {
      setReadyState(OPEN);
      next(activity);
    })
  );

  expect(adapter.readyState).toBe(CONNECTING);

  adapter.ingress(1);

  expect(adapter.readyState).toBe(OPEN);
});
