import { Adapter, ReadyState } from './types/AdapterTypes';
import { compose } from 'redux';
import applyEgressMiddleware from './applyEgressMiddleware';
import applyIngressMiddleware from './applyIngressMiddleware';
import applySubscribeMiddleware from './applySubscribeMiddleware';
import createAdapter from './createAdapter';
import createIC3AdapterEnhancer from './ic3/createAdapterEnhancer';
import exportDLJSInterface from './enhancers/exportDLJSInterface';

export default createAdapter;

const { CLOSED, CONNECTING, OPEN } = ReadyState;

export {
  applyEgressMiddleware,
  applyIngressMiddleware,
  applySubscribeMiddleware,
  CLOSED,
  compose,
  CONNECTING,
  createIC3AdapterEnhancer,
  exportDLJSInterface,
  OPEN
};

export type { Adapter };
