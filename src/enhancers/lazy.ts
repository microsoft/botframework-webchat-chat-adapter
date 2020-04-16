/// <reference path="../types/external.d.ts" />

import entries from 'core-js/features/object/entries';

import { Adapter, AdapterCreator, AdapterOptions, IterateActivitiesOptions } from '../types/AdapterTypes';

type LazyAdapter<TActivity> = Adapter<TActivity> & {
  [key: string]: any;
};

// Only create adapter when activities is being iterated.
export default function createLazy<TActivity>() {
  return (next: AdapterCreator<TActivity>) => (options: AdapterOptions): Adapter<TActivity> => {
    let adapter: Adapter<TActivity>;

    const lazy: LazyAdapter<TActivity> = {
      activities: (options?: IterateActivitiesOptions) => {
        // The next time this function is called, it will be calling the adapter.activities() instead.
        adapter = next(options);

        entries(adapter).forEach(([key, value]) => {
          lazy[key] = typeof value === 'function' ? value.bind(lazy) : value;
        });

        return adapter.activities(options);
      },

      addEventListener: () => {
        throw new Error('You must call activities() first.');
      },

      close: () => {
        throw new Error('You must call activities() first.');
      },

      dispatchEvent: () => {
        throw new Error('You must call activities() first.');
      },

      egress: () => Promise.reject(new Error('You must call activities() first.')),

      ingress: () => {
        throw new Error('You must call activities() first.');
      },

      removeEventListener: () => {
        throw new Error('You must call activities() first.');
      }
    };

    return lazy;
  };
}
