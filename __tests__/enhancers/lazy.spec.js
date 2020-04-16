const { compose } = require('redux');

const asyncIterableToArray = require('../__jest__/asyncIterableToArray');

const { default: createAdapter, applyEgressMiddleware, applyIngressMiddleware, CONNECTING, OPEN } = require('../../src/index');
const { default: createLazyEnhancer } = require('../../src/enhancers/lazy');

describe('lazy', () => {
  let adapter;
  let baseAdapter;
  let cstr;
  let custom;
  let egress;
  let ingress;
  let setReadyState;

  beforeEach(() => {
    cstr = jest.fn();
    custom = jest.fn();
    egress = jest.fn();

    baseAdapter = {
      custom,
      field: 1
    };

    adapter = createAdapter(
      {},
      compose(
        createLazyEnhancer(),
        applyIngressMiddleware(({ ingress: ingressAPI, setReadyState: setReadyStateAPI }) => {
          ingress = ingressAPI;
          setReadyState = setReadyStateAPI;

          return next => activity => next(activity);
        }),
        applyEgressMiddleware(() => () => egress),
        next => options => {
          cstr();

          return { ...next(options), ...baseAdapter };
        }
      )
    );
  });

  describe('after calling activities()', () => {
    let activities;

    beforeEach(() => {
      activities = adapter.activities();
    });

    test('should not "constructor" once', () => {
      expect(cstr).toHaveBeenCalledTimes(1);
    });

    test('should unblock ingress', async () => {
      ingress(1);
      ingress(2);

      await expect(asyncIterableToArray(activities, 2)).resolves.toEqual([1, 2]);
    });

    test('should unblock egress', () => {
      egress(10);

      expect(egress).toHaveBeenCalledTimes(1);
      expect(egress).toHaveBeenCalledWith(10);
    });

    test('should unblock custom members', () => {
      adapter.custom();

      expect(custom).toHaveBeenCalledTimes(1);
    });

    test('should unblock field', () => {
      expect(adapter).toHaveProperty('field', 1);
    });

    test('and call activities() again', async () => {
      const activities2 = adapter.activities();

      ingress(1);
      ingress(2);

      await expect(asyncIterableToArray(activities, 2)).resolves.toEqual([1, 2]);
      await expect(asyncIterableToArray(activities2, 2)).resolves.toEqual([1, 2]);
    });

    test('call setReadyState() should set readyState', () => {
      expect(adapter.readyState).toBe(CONNECTING);

      setReadyState(OPEN);

      expect(adapter.readyState).toBe(OPEN);
    });
  });

  describe('before calling activities()', () => {
    test('should not call "constructor"', () => {
      expect(cstr).toHaveBeenCalledTimes(0);
    });

    test('should throw on close()', () => {
      expect(() => adapter.close()).toThrow();
    });

    test('should throw on egress()', async () => {
      await expect(adapter.egress(1)).rejects.toThrow();
    });

    test('should throw on ingress()', () => {
      expect(() => adapter.ingress()).toThrow();
    });

    test('should throw on addEventListener()', () => {
      expect(() => adapter.addEventListener()).toThrow();
    });

    test('should throw on removeEventListener()', () => {
      expect(() => adapter.removeEventListener()).toThrow();
    });

    test('should throw on dispatchEvent()', () => {
      expect(() => adapter.dispatchEvent()).toThrow();
    });

    test('should throw on setReadyState()', () => {
      expect(() => adapter.setReadyState()).toThrow();
    });

    test('should return 0 on readyState', () => {
      expect(adapter).toHaveProperty('readyState', 0);
    });

    test('should throw on custom()', () => {
      expect(() => adapter.custom()).toThrow();
    });

    test('should not have "field"', () => {
      expect('field' in adapter).toBeFalsy();
    });
  });
});
