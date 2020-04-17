/// <reference path="../types/external.d.ts" />

import entries from 'core-js/features/object/entries';

import { Adapter, AdapterCreator, AdapterOptions, IterateActivitiesOptions, ReadyState } from '../types/AdapterTypes';

type LazyAdapter<TActivity> = Adapter<TActivity> & {
  [key: string]: any;
};

const SUPPORTED_FUNCTIONS = [
  'activities',
  'addEventListener',
  'close',
  'dispatchEvent',
  'egress',
  'ingress',
  'getReadyState',
  'removeEventListener',
  'setReadyState'
];

// Only create adapter when activities is being iterated.
export default function createLazyEnhancer<TActivity>() {
  return (next: AdapterCreator<TActivity>) => (adapterOptions: AdapterOptions): Adapter<TActivity> => {
    let adapter: Adapter<TActivity>;

    return {
      activities: (options?: IterateActivitiesOptions) => {
        // The next time this function is called, it will be calling the adapter.activities() instead.
        adapter = next(adapterOptions);

        if (Object.keys(adapter).some(name => !~SUPPORTED_FUNCTIONS.indexOf(name))) {
          throw new Error('Lazy enhancer cannot be used on adapters with extra functions.');
        }

        return adapter.activities(options);
      },

      addEventListener: (...args) => {
        if (!adapter) {
          throw new Error('You must call activities() first.');
        }

        return adapter.addEventListener(...args);
      },

      close: (...args) => {
        if (!adapter) {
          throw new Error('You must call activities() first.');
        }

        return adapter.close(...args);
      },

      dispatchEvent: (...args) => {
        if (!adapter) {
          throw new Error('You must call activities() first.');
        }

        return adapter.dispatchEvent(...args);
      },

      egress: (...args) => {
        if (!adapter) {
          return Promise.reject(new Error('You must call activities() first.'));
        }

        return adapter.egress(...args);
      },

      ingress: (...args) => {
        if (!adapter) {
          throw new Error('You must call activities() first.');
        }

        return adapter.ingress(...args);
      },

      getReadyState: (...args) => {
        if (!adapter) {
          throw new Error('You must call activities() first.');
        }

        return adapter.getReadyState(...args);
      },

      removeEventListener: (...args) => {
        if (!adapter) {
          throw new Error('You must call activities() first.');
        }

        return adapter.removeEventListener(...args);
      },

      setReadyState: (...args) => {
        if (!adapter) {
          throw new Error('You must call activities() first.');
        }

        return adapter.setReadyState(...args);
      }
    };
  };
}
