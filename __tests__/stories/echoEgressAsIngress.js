import { compose } from 'redux';
import asyncIterableToArray from '../__jest__/asyncIterableToArray';

import createAdapter, { applyEgressMiddleware } from '../../src/index';

test('egress to echo back as ingress', async () => {
  const adapter = createAdapter(
    {},
    compose(applyEgressMiddleware(({ ingress }) => () => async activity => ingress(activity * 20)))
  );

  const activitiesIterable = adapter.activities();

  await adapter.egress(1);

  adapter.close();

  await expect(asyncIterableToArray(activitiesIterable)).resolves.toEqual([20]);
});
