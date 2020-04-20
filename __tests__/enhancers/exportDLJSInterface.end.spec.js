import { compose } from 'redux';

import createAdapter, { exportDLJSInterface } from '../../src/index';

describe('exportDLJSInterface.end', () => {
  test('end should become close', async () => {
    const close = jest.fn();

    const adapter = createAdapter(
      {},
      compose(exportDLJSInterface(), next => options => ({ ...next(options), close }))
    );

    expect(close).toHaveBeenCalledTimes(0);

    adapter.end();

    expect(close).toHaveBeenCalledTimes(1);
  });
});
