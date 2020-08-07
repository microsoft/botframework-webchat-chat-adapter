import { Adapter, ReadyState } from './types/AdapterTypes';
import { compose } from 'redux';
import applyEgressMiddleware from './applyEgressMiddleware';
import applyIngressMiddleware from './applyIngressMiddleware';
import applySetStateMiddleware from './applySetStateMiddleware';
import applySubscribeMiddleware from './applySubscribeMiddleware';
import createAdapter from './createAdapter';
import createIC3AdapterEnhancer from './ic3/createAdapterEnhancer';
import exportDLJSInterface from './enhancers/exportDLJSInterface';

export default createAdapter;

const { CLOSED, CONNECTING, OPEN } = ReadyState;

export {
  applyEgressMiddleware,
  applyIngressMiddleware,
  applySetStateMiddleware,
  applySubscribeMiddleware,
  CLOSED,
  compose,
  CONNECTING,
  createIC3AdapterEnhancer,
  exportDLJSInterface,
  OPEN
};

export type { Adapter };

// TODO: Expose the IC3 adapter in a better way.
// TODO: Allow devs to insert enhancer to modify the behavior of the final adapter.

import { IIC3AdapterOptions } from './types/ic3/IIC3AdapterOptions';
import updateIn from 'simple-update-in';

window.Microsoft || ((window as any ).Microsoft = {});

(window.Microsoft as any).BotFramework = updateIn(
  (window.Microsoft as any).BotFramework || {},
  ['WebChat', 'createIC3Adapter'],
  () => (options: IIC3AdapterOptions) =>
    createAdapter(
      {},
      compose(
        exportDLJSInterface(), 
        createIC3AdapterEnhancer(options,),
      )
    )
);
