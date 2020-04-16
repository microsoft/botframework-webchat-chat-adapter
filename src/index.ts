import { ReadyState } from './types/AdapterTypes';
import applyEgressMiddleware from './applyEgressMiddleware';
import applyIngressMiddleware from './applyIngressMiddleware';
import applySetReadyStateMiddleware from './applySetReadyStateMiddleware';
import createAdapter from './createAdapter';

export default createAdapter;

const { CLOSED, CONNECTING, OPEN } = ReadyState;

export { applyEgressMiddleware, applyIngressMiddleware, applySetReadyStateMiddleware, CLOSED, CONNECTING, OPEN };
