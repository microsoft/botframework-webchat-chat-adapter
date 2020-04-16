const { compose } = require('redux');

const observableToArray = require('../__jest__/observableToArray');

const { default: createAdapter } = require('../../src/createAdapter');
const { default: exportDLJSInterface } = require('../../src/enhancers/exportDLJSInterface');

const checkpoint = require('../__jest__/checkpoint');

describe('exportDLJSInterface.postActivity', () => {
  test('postActivity should become egress', async () => {
    const checkpoint1 = checkpoint();
    const checkpoint2 = checkpoint();
    const checkpoint3 = checkpoint();

    const adapter = createAdapter(
      {},
      compose(exportDLJSInterface(), () => () => ({
        egress: async (activity, { progress }) => {
          await checkpoint1.pause();

          progress({ ...activity, timestamp: '2000-01-23T12:34:56.000Z' });

          await checkpoint2.pause();

          progress({ ...activity, id: '1' });

          await checkpoint3.pause();

          progress({ ...activity, id: '2' });
        }
      }))
    );

    let interims;
    const observable = adapter.postActivity({ value: 1 });
    const activityPromise = observableToArray(observable, {
      progress: array => {
        interims = array;
      }
    });

    await checkpoint1.resume();

    // The first checkpoint do not set the "id" field.
    expect(interims).toBeUndefined();

    await checkpoint2.resume();

    // The second checkpoint will set the "id" field.
    expect(interims).toEqual(['1']);

    await checkpoint3.resume();

    await expect(activityPromise).resolves.toEqual(['1', '2']);
  });
});
