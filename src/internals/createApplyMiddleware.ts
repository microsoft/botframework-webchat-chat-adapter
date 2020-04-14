import { compose } from 'redux';

import { Adapter, AdapterAPI, AdapterCreator, AdapterEnhancer, AdapterOptions } from '../types/AdapterTypes';
import extractAdapterAPI from '../extractAdapterAPI';

type Middleware<TActivity, TFunction> = (adapterAPI: AdapterAPI<TActivity>) => (next: TFunction) => TFunction;

type AdapterMutator<TActivity, TFunction> = (
  options: AdapterOptions,
  chain: (final: TFunction) => TFunction,
  adapter: Adapter<TActivity>
) => Adapter<TActivity>;

// This will convert multiple middlewares into a single enhancer.
// Enhancer is another middleware for the constructor of adapter. Essentially HOC for adapter.
// We can chain multiple enhancer together, and plug-in multiple features to a single adapter.
// In the future, if we decided to change Adapter, middleware written by user can still be reused. We won't introduce breaking changes.
export default function createApplyMiddleware<TActivity, TFunction>(mutator: AdapterMutator<TActivity, TFunction>) {
  return (...middlewares: Middleware<TActivity, TFunction>[]): AdapterEnhancer<TActivity> => {
    return nextCreator => options => {
      const adapter = nextCreator(options);
      const api = extractAdapterAPI(adapter);
      const chain = middlewares.map(middleware => middleware(api));

      return mutator(options, compose<TFunction>(...chain), adapter);
    };
  };
}

export type { Middleware };
