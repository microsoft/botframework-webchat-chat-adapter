/// <reference path="../types/external.d.ts" />

import entries from 'core-js/features/object/entries';

import {
  AdapterCreator,
  AdapterOptions,
  InterimAdapter,
  IterateActivitiesOptions,
  ReadyState
} from '../types/AdapterTypes';

type LazyAdapter<TActivity> = InterimAdapter<TActivity> & {
  [key: string]: any;
};

const SUPPORTED_FUNCTIONS = ['activities', 'close', 'egress', 'ingress', 'getReadyState', 'setReadyState'];

// Only create adapter when activities is being iterated.
export default function createLazyEnhancer<TActivity>() {
  return (next: AdapterCreator<TActivity>) => (adapterOptions: AdapterOptions): InterimAdapter<TActivity> => {
    let adapter: InterimAdapter<TActivity>;

    return {
      activities: (options?: IterateActivitiesOptions) => {
        // The next time this function is called, it will be calling the adapter.activities() instead.
        adapter = next(adapterOptions);

        if (Object.keys(adapter).some(name => !~SUPPORTED_FUNCTIONS.indexOf(name))) {
          throw new Error('Lazy enhancer cannot be used on adapters with extra functions.');
        }

        return adapter.activities(options);
      },

      close: (...args) => {
        if (!adapter) {
          throw new Error('You must call activities() first.');
        }

        return adapter.close(...args);
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

      setReadyState: (readyState: ReadyState) => {
        if (!adapter) {
          throw new Error('You must call activities() first.');
        }

        return adapter.setReadyState(readyState);
      }
    };
  };
}
