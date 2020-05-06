/// <reference path="../../../../src/types/ic3/external/Model.d.ts" />
import { IC3AdapterState } from '../../../types/ic3/IC3AdapterState';
import { IC3DirectLineActivity } from '../../../types/ic3/IC3DirectLineActivity';
import { IngressMiddleware } from '../../../applyIngressMiddleware';
export default function createPatchFromRoleAndNameMiddleware(): IngressMiddleware<IC3DirectLineActivity, IC3AdapterState>;
