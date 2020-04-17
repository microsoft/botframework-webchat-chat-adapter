const { compose } = require('redux');

const { default: createAdapter } = require('../../src/createAdapter');
const { default: exportDLJSInterface } = require('../../src/enhancers/exportDLJSInterface');

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
