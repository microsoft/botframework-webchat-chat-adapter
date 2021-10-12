import { Adapter, ReadyState } from './types/AdapterTypes';

import { IIC3AdapterOptions } from './types/ic3/IIC3AdapterOptions';
import applyEgressMiddleware from './applyEgressMiddleware';
import applyIngressMiddleware from './applyIngressMiddleware';
import applySetStateMiddleware from './applySetStateMiddleware';
import applySubscribeMiddleware from './applySubscribeMiddleware';
import { compose } from 'redux';
import createAdapter from './createAdapter';
import createIC3AdapterEnhancer from './ic3/createAdapterEnhancer';
import exportDLJSInterface from './enhancers/exportDLJSInterface';
import updateIn from 'simple-update-in';

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


window.Microsoft || ((window as any ).Microsoft = {});

(window.Microsoft as any).BotFramework = updateIn(
  (window.Microsoft as any).BotFramework || {},
  ['WebChat', 'createIC3Adapter'],
  () => (options: IIC3AdapterOptions, logger: Microsoft.CRM.Omnichannel.IC3Client.Model.ILogger) =>
    // TODO: Why is logger separated out? In the original code, we can put it in options and make it look flushed.
    createAdapter(
      {},
      compose(
        exportDLJSInterface(), 
        createIC3AdapterEnhancer({ ...options, logger }),
      ),
      logger
    )
);
