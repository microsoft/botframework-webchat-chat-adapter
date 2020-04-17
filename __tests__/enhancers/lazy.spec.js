const { compose } = require('redux');

const asyncIterableToArray = require('../__jest__/asyncIterableToArray');

const {
  default: createAdapter,
  applyEgressMiddleware,
  applyIngressMiddleware,
  CONNECTING,
  OPEN
} = require('../../src/index');
const { default: createLazyEnhancer } = require('../../src/enhancers/lazy');

describe('lazy', () => {
  let adapter;
  let cstr;
  let egress;
  let ingress;
  let setReadyState;

  beforeEach(() => {
    cstr = jest.fn();
    egress = jest.fn();

    adapter = createAdapter(
      {},
      compose(
        next => options => {
          const adapter = next(options);

          setReadyState = adapter.setReadyState;

          return adapter;
        },
        createLazyEnhancer(),
        applyIngressMiddleware(({ ingress: ingressAPI }) => {
          ingress = ingressAPI;

          return next => activity => next(activity);
        }),
        applyEgressMiddleware(() => () => (...args) => {
          egress(...args);
        }),
        next => options => {
          cstr();

          return next(options);
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
      adapter.ingress(1);
      adapter.ingress(2);

      await expect(asyncIterableToArray(activities, 2)).resolves.toEqual([1, 2]);
    });

    test('should unblock egress', () => {
      adapter.egress(10);

      expect(egress).toHaveBeenCalledTimes(1);
      expect(egress).toHaveBeenCalledWith(10);
    });

    test('should unblock close', () => {
      adapter.close();
    });

    test('and call activities() again', async () => {
      const activities2 = adapter.activities();

      adapter.ingress(1);
      adapter.ingress(2);

      await expect(asyncIterableToArray(activities, 2)).resolves.toEqual([1, 2]);
      await expect(asyncIterableToArray(activities2, 2)).resolves.toEqual([1, 2]);
    });

    test('call setReadyState() should set readyState', () => {
      expect(adapter.readyState).toBe(CONNECTING);

      setReadyState(OPEN);

      expect(adapter.readyState).toBe(OPEN);
    });

    test('event target should work', () => {
      const handler = jest.fn();

      adapter.addEventListener('load', handler);
      adapter.dispatchEvent(new Event('load'));
      adapter.removeEventListener('load', handler);
      adapter.dispatchEvent(new Event('load'));

      expect(handler).toHaveBeenCalledTimes(1);
    });
  });

  describe('before calling activities()', () => {
    test('should not call "constructor"', () => {
      expect(cstr).toHaveBeenCalledTimes(0);
    });

    test.each([['addEventListener'], ['close'], ['dispatchEvent'], ['ingress'], ['removeEventListener']])(
      'when calling %s() should throw',
      name => {
        expect(() => adapter[name]()).toThrow('call activities()');
      }
    );

    test('should throw on egress()', async () => {
      await expect(adapter.egress(1)).rejects.toThrow('call activities()');
    });

    test('should throw on readyState getter', () => {
      expect(() => adapter.readyState).toThrow('call activities()');
    });

    test('should throw on setReadyState', () => {
      expect(() => setReadyState(OPEN)).toThrow('call activities()');
    });
  });
});

test('lazy on adapter with extra functions should throw', () => {
  const adapter = createAdapter(
    {},
    compose(createLazyEnhancer(), next => options => ({ ...next(options), customFn: () => {} }))
  );

  expect(() => adapter.activities()).toThrow('adapters with extra functions');
});
