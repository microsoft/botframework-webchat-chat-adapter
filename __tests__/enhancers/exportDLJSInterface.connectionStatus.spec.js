const observableToArray = require('../__jest__/observableToArray');

const { default: createAdapter } = require('../../src/createAdapter');
const { default: exportDLJSInterface } = require('../../src/enhancers/exportDLJSInterface');

describe('exportDLJSInterface.connectionStatus$', () => {
  let adapter;

  beforeEach(() => {
    adapter = createAdapter({}, exportDLJSInterface());
  });

  test('"open"/"error" should set connectionStatus$ accordingly', async () => {
    let interims;
    const abortController = new AbortController();

    const promise = observableToArray(adapter.connectionStatus$, {
      progress: array => {
        interims = array;
      },
      signal: abortController.signal
    });

    adapter.dispatchEvent(new Event('open'));

    expect(interims).toEqual([0, 1, 2]);

    adapter.dispatchEvent(new Event('error'));

    expect(interims).toEqual([0, 1, 2, 1]);

    adapter.dispatchEvent(new Event('open'));

    expect(interims).toEqual([0, 1, 2, 1, 2]);

    abortController.abort();

    adapter.dispatchEvent(new Event('error'));

    await expect(promise).rejects.toThrow('aborted');
  });
});
