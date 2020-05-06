/// <reference path="../../../../src/types/ic3/external/Model.d.ts" />
import { EgressMiddleware } from '../../../applyEgressMiddleware';
import { IC3AdapterState } from '../../../types/ic3/IC3AdapterState';
import { IC3DirectLineActivity } from '../../../types/ic3/IC3DirectLineActivity';
export default function createEgressMessageActivityMiddleware(): EgressMiddleware<IC3DirectLineActivity, IC3AdapterState>;
