/**
 * @jest-environment jsdom
 */

const observableToArray = require('../__jest__/observableToArray');

const { default: createAdapter } = require('../../src/createAdapter');
const { default: exportDLJSInterface } = require('../../src/enhancers/exportDLJSInterface');

describe('exportDLJSInterface', () => {
  let adapter;

  beforeEach(() => {
    adapter = createAdapter({}, exportDLJSInterface());
  });

  test('complete iteration of activity$', async () => {
    const activitiesPromise = observableToArray(adapter.activity$);

    adapter.ingress(1);
    adapter.ingress(2);
    adapter.ingress(3);
    adapter.close();

    await expect(activitiesPromise).resolves.toEqual([1, 2, 3]);
  });

  test('partial iteration of activity$', async () => {
    const activitiesPromise1 = observableToArray(adapter.activity$, { count: 2 });

    adapter.ingress(1);
    adapter.ingress(2);

    await expect(activitiesPromise1).resolves.toEqual([1, 2]);

    const activitiesPromise2 = observableToArray(adapter.activity$);

    adapter.ingress(3);
    adapter.ingress(4);
    adapter.ingress(5);
    adapter.close();

    await expect(activitiesPromise2).resolves.toEqual([3, 4, 5]);
  });

  test('2 simultaneous iterations of activity$', async () => {
    const activitiesPromise1 = observableToArray(adapter.activity$);
    const activitiesPromise2 = observableToArray(adapter.activity$);

    adapter.ingress(1);
    adapter.ingress(2);
    adapter.ingress(3);
    adapter.close();

    await expect(activitiesPromise1).resolves.toEqual([1, 2, 3]);
    await expect(activitiesPromise2).resolves.toEqual([1, 2, 3]);
  });

  test('"open"/"error" should set connectionStatus$ accordingly', async () => {
    let interims;

    observableToArray(adapter.connectionStatus$, {
      progress: array => {
        interims = array;
      }
    });

    adapter.dispatchEvent(new Event('open'));

    expect(interims).toEqual([0, 1, 2]);

    adapter.dispatchEvent(new Event('error'));

    expect(interims).toEqual([0, 1, 2, 1]);

    adapter.dispatchEvent(new Event('open'));

    expect(interims).toEqual([0, 1, 2, 1, 2]);
  });
});
