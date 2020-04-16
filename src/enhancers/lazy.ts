/// <reference path="../types/external.d.ts" />

import entries from 'core-js/features/object/entries';

import { Adapter, AdapterCreator, AdapterOptions, IterateActivitiesOptions, ReadyState } from '../types/AdapterTypes';

type LazyAdapter<TActivity> = Adapter<TActivity> & {
  [key: string]: any;
};

// Only create adapter when activities is being iterated.
export default function createLazy<TActivity>() {
  return (next: AdapterCreator<TActivity>) => (adapterOptions: AdapterOptions): Adapter<TActivity> => {
    let adapter: Adapter<TActivity>;

    const lazy: LazyAdapter<TActivity> ={
      activities: (options?: IterateActivitiesOptions) => {
        // The next time this function is called, it will be calling the adapter.activities() instead.
        adapter = next(adapterOptions);

        entries(adapter).forEach(([key, value]) => {
          if (key !== 'readyState') {
            Object.defineProperty(lazy, key, {
              get: () => (typeof value === 'function' ? value.bind(adapter) : value)
            });
          }
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

      readyState: ReadyState.CONNECTING,

      removeEventListener: () => {
        throw new Error('You must call activities() first.');
      },

      setReadyState: () => {
        throw new Error('You must call activities() first.');
      }
    };

    return lazy;
  };
}
