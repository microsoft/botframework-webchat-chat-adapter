import { compose } from 'redux';

import { AdapterState, AdapterEnhancer, MiddlewareAPI } from '../types/AdapterTypes';
import extractAdapterAPI from '../extractAdapterAPI';

type Middleware<TActivity, TAdapterState extends AdapterState, TFunction> = (
  adapterAPI: MiddlewareAPI<TActivity, TAdapterState>
) => (next: TFunction) => TFunction | void;

// This will convert multiple middlewares into a single enhancer.
// Enhancer is another middleware for the constructor of adapter. Essentially HOC for adapter.
// We can chain multiple enhancer together, and plug-in multiple features to a single adapter.
// In the future, if we decided to change Adapter, middleware written by user can still be reused. We won't introduce breaking changes.
export default function createApplyMiddleware<TActivity, TAdapterState extends AdapterState, TFunction>(
  getFunction: (api: MiddlewareAPI<TActivity, TAdapterState>) => TFunction,
  setFunction: (
    api: MiddlewareAPI<TActivity, TAdapterState>,
    fn: TFunction
  ) => MiddlewareAPI<TActivity, TAdapterState>
) {
  return (
    ...middlewares: Middleware<TActivity, TAdapterState, TFunction>[]
  ): AdapterEnhancer<TActivity, TAdapterState> => {
    return nextCreator => options => {
      const adapter = nextCreator(options);

      if (Object.getPrototypeOf(adapter) !== Object.prototype) {
        throw new Error('One of the enhancer is returning the adapter as a class object. This is not supported.');
      }

      // TODO: We should change type "any" to "TFunction"
      let fn: any = () => {
        throw new Error(
          'Calling function while constructing your middleware is not allowed. Other middleware would not be applied to this function.'
        );
      };

      // TODO: We should change type "any" to "TFunction"
      const proxyFn: any = (...args: any[]) => fn(...args);

      const api: MiddlewareAPI<TActivity, TAdapterState> = setFunction(extractAdapterAPI(adapter), proxyFn);
      const chain = middlewares.map(middleware => middleware(api));

      if (chain.some(fn => typeof fn !== 'function')) {
        throw new Error('All middlewares must return a function after caling with middleware API.');
      }

      fn = compose<TFunction>(...chain)(getFunction(adapter));

      return { ...adapter, ...setFunction(adapter, fn) };
    };
  };
}

export type { Middleware };
