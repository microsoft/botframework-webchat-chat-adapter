/// <reference path="../types/external.d.ts" />

import {
  Adapter,
  AdapterState,
  AdapterCreator,
  AdapterOptions,
  IterateActivitiesOptions
} from '../types/AdapterTypes';

const SUPPORTED_FUNCTIONS = [
  'activities',
  'addEventListener',
  'close',
  'dispatchEvent',
  'egress',
  'getReadyState',
  'getState',
  'ingress',
  'removeEventListener',
  'setReadyState',
  'setState',
  'subscribe',
  'updateChatToken'
];

// Only create adapter when activities is being iterated.
export default function createLazyEnhancer<TActivity, TAdapterState extends AdapterState>() {
  return (next: AdapterCreator<TActivity, TAdapterState>) => (
    adapterOptions: AdapterOptions
  ): Adapter<TActivity, TAdapterState> => {
    let adapter: Adapter<TActivity, TAdapterState>;

    return {
      activities: (options?: IterateActivitiesOptions) => {
        // The next time this function is called, it will be calling the adapter.activities() instead.
        if (!adapter) {
          adapter = next(adapterOptions);
        }

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

      getState: (...args) => {
        if (!adapter) {
          throw new Error('You must call activities() first.');
        }

        return adapter.getState(...args);
      },

      getReadyState: (...args) => {
        if (!adapter) {
          throw new Error('You must call activities() first.');
        }

        return adapter.getReadyState(...args);
      },

      ingress: (...args) => {
        if (!adapter) {
          throw new Error('You must call activities() first.');
        }

        return adapter.ingress(...args);
      },

      subscribe: (...args) => {
        if (!adapter) {
          throw new Error('You must call activities() first.');
        }

        return adapter.subscribe(...args);
      },

      setState: (...args) => {
        if (!adapter) {
          throw new Error('You must call activities() first.');
        }

        return adapter.setState(...args);
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
      },

      updateChatToken: (...args) => {
        if (!adapter) {
          throw new Error('You must call activities() first.');
        }

        return adapter.updateChatToken(...args);
      }
    };
  };
}
