const { compose } = require('redux');
const asyncIterableToArray = require('./__jest__/asyncIterableToArray');

const { default: createAdapter } = require('../src/createAdapter');
const { default: applyIngressMiddleware } = require('../src/applyIngressMiddleware');
const { default: applyEgressMiddleware } = require('../src/applyEgressMiddleware');

test('egress to echo back as ingress', async () => {
  const adapter = createAdapter(
    {},
    compose(
      applyEgressMiddleware(({ ingress }) => () => async activity => ingress(activity * 20)),
      applyIngressMiddleware(() => next => activity => next(activity + 100))
    )
  );

  const activitiesIterable = adapter.activities();

  await adapter.egress(1);

  adapter.close();

  await expect(asyncIterableToArray(activitiesIterable)).resolves.toEqual([120]);
});
