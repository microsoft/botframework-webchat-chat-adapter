const { compose } = require('redux');
const observableToArray = require('../__jest__/observableToArray');

const { default: createAdapter, CLOSED, CONNECTING, OPEN } = require('../../src/index');
const { default: exportDLJSInterface } = require('../../src/enhancers/exportDLJSInterface');

describe('exportDLJSInterface.connectionStatus$', () => {
  let adapter;
  let setReadyState;

  beforeEach(() => {
    adapter = createAdapter(
      {},
      compose(
        next => options => {
          const adapter = next(options);

          setReadyState = adapter.setReadyState;

          return adapter;
        },
        exportDLJSInterface()
      )
    );
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

    setReadyState(OPEN);

    expect(interims).toEqual([0, 1, 2]);

    setReadyState(CONNECTING);

    expect(interims).toEqual([0, 1, 2, 1]);

    setReadyState(OPEN);

    expect(interims).toEqual([0, 1, 2, 1, 2]);

    setReadyState(CLOSED);

    abortController.abort();

    expect(interims).toEqual([0, 1, 2, 1, 2, 4]);

    await expect(promise).rejects.toThrow('aborted');
  });

  test('setReadyState should not throw if no subscription to connectionStatsu$', () => {
    setReadyState(OPEN);
  });
});
