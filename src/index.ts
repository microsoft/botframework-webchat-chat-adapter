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

import { IIC3AdapterOptions } from './types/ic3/IIC3AdapterOptions';
import updateIn from 'simple-update-in';

window.Microsoft.BotFramework = updateIn(
  window.Microsoft.BotFramework || {},
  ['WebChat', 'createIC3Adapter'],
  () => (options: IIC3AdapterOptions, logger: Microsoft.CRM.Omnichannel.IC3Client.Model.ILogger) =>
    createAdapter({}, compose(exportDLJSInterface(), createIC3AdapterEnhancer({ ...options, logger })))
);
