import { compose } from 'redux';

import createAdapter from '../src/index';
import createApplyMiddleware from '../src/internals/createApplyMiddleware';

test('adding a new function', () => {
  const close = jest.fn();
  const egress = jest.fn();
  const ingress = jest.fn();
  const getState = jest.fn();
  const setState = jest.fn();
  const getReadyState = jest.fn();
  const setReadyState = jest.fn();

  const custom = jest.fn();
  const adapter = createAdapter(
    {},
    compose(
      createApplyMiddleware(
        api => api.custom,
        (api, fn) => ({ ...api, custom: fn })
      )(({ close, egress, ingress, getState, setState, getReadyState, setReadyState }) => next => activity => {
        close('close');
        egress('egress');
        ingress('ingress');
        getState('getState');
        setState('setState', 1);
        getReadyState('getReadyState');
        setReadyState('setReadyState');

        custom(activity);

        return next && next(activity);
      }),
      next => options => {
        return {
          ...next(options),
          close,
          egress,
          ingress,
          getState,
          setState,
          getReadyState,
          setReadyState
        };
      }
    )
  );

  adapter.custom(1);

  expect(custom).toHaveBeenCalledTimes(1);
  expect(custom).toHaveBeenCalledWith(1);

  expect(close).toHaveBeenCalledTimes(1);
  expect(close).toHaveBeenCalledWith('close');

  expect(egress).toHaveBeenCalledTimes(1);
  expect(egress).toHaveBeenCalledWith('egress');

  expect(ingress).toHaveBeenCalledTimes(1);
  expect(ingress).toHaveBeenCalledWith('ingress');

  expect(getState).toHaveBeenCalledTimes(1);
  expect(getState).toHaveBeenCalledWith('getState');

  expect(setState).toHaveBeenCalledTimes(1);
  expect(setState).toHaveBeenCalledWith('setState', 1);

  expect(getReadyState).toHaveBeenCalledTimes(1);
  expect(getReadyState).toHaveBeenCalledWith('getReadyState');

  expect(setReadyState).toHaveBeenCalledTimes(1);
  expect(setReadyState).toHaveBeenCalledWith('setReadyState');
});

test('using getState and setState', () => {
  const adapter = createAdapter(
    {},
    createApplyMiddleware(
      api => api.custom,
      (api, fn) => ({ ...api, custom: fn })
    )(({ setState }) => {
      setState('value');

      return next => value => {
        setState('value', value);

        return next && next(value);
      };
    })
  );

  expect(adapter.value).toBeUndefined();

  adapter.custom('123');

  expect(adapter.value).toBe('123');
});

test('call setState with a non-defined entry after seal should throw', () => {
  let setState;
  const adapter = createAdapter({}, next => options => {
    const adapter = next(options);

    setState = adapter.setState;
    setState('predefined', 1);

    return adapter;
  });

  expect(adapter.predefined).toBe(1);

  setState('predefined', 2);

  expect(adapter.predefined).toBe(2);
  expect(() => setState('not defined', 1)).toThrow();
});
