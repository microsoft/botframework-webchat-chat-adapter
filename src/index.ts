import { Adapter, ReadyState } from './types/AdapterTypes';
import { compose } from 'redux';
import applyEgressMiddleware from './applyEgressMiddleware';
import applyIngressMiddleware from './applyIngressMiddleware';
import createAdapter from './createAdapter';
import exportDLJSInterface from './enhancers/exportDLJSInterface';

export default createAdapter;

const { CLOSED, CONNECTING, OPEN } = ReadyState;

export { applyEgressMiddleware, applyIngressMiddleware, CLOSED, compose, CONNECTING, exportDLJSInterface, OPEN };

export type { Adapter };
