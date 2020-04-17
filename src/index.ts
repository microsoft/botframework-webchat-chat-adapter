import { Adapter, ReadyState } from './types/AdapterTypes';
import applyEgressMiddleware from './applyEgressMiddleware';
import applyIngressMiddleware from './applyIngressMiddleware';
import createAdapter from './createAdapter';

export default createAdapter;

const { CLOSED, CONNECTING, OPEN } = ReadyState;

export { applyEgressMiddleware, applyIngressMiddleware, CLOSED, CONNECTING, OPEN };

export type { Adapter }
