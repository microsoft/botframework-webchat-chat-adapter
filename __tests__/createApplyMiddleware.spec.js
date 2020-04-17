const { compose } = require('redux');

const { default: createAdapter } = require('../src/index');
const { default: createApplyMiddleware } = require('../src/internals/createApplyMiddleware');

test('adding a new function', () => {
  const close = jest.fn();
  const egress = jest.fn();
  const ingress = jest.fn();
  const getReadyState = jest.fn();
  const setReadyState = jest.fn();

  const custom = jest.fn();
  const adapter = createAdapter(
    {},
    compose(
      createApplyMiddleware(
        api => api.custom,
        (api, fn) => ({ ...api, custom: fn })
      )(({ close, egress, ingress, getReadyState, setReadyState }) => next => activity => {
        close('close');
        egress('egress');
        ingress('ingress');
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

  expect(getReadyState).toHaveBeenCalledTimes(1);
  expect(getReadyState).toHaveBeenCalledWith('getReadyState');

  expect(setReadyState).toHaveBeenCalledTimes(1);
  expect(setReadyState).toHaveBeenCalledWith('setReadyState');
});
