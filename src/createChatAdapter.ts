import { AdapterOptions, AdapterEnhancer } from './types/ChatAdapterTypes';

const DEFAULT_ENHANCER: AdapterEnhancer = next => options => next(options);

export default function createChatAdapter(options: AdapterOptions, enhancer: AdapterEnhancer = DEFAULT_ENHANCER) {
  return enhancer(() => ({
    // TODO: Implement this adapter using IC3SDK.
    //       Don't implement using RxJS@5 because it's obsoleted. Implement using ES Observable from core-js.
    //       Also, don't use any operators from RxJS package. It make the logic unreadable and very difficult to debug.
    //       Currently, we are using options.mockXXX$ so we can easily test the enhancer/middleware pattern.

    activity$: options.mockActivity$,
    connectionStatus$: options.mockConnectionStatus$,

    end: () => {
      throw new Error('not implemented');
    },

    postActivity: () => {
      throw new Error('not implemented');
    }
  }))(options);
}
