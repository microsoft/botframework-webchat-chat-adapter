/// <reference path="../../../types/ic3/external/Model.d.ts" />

import { compose } from 'redux';

import { AdapterEnhancer } from '../../../types/AdapterTypes';
import { applyIngressMiddleware } from '../../..';
import { IC3AdapterState } from '../../../types/ic3/IC3AdapterState';
import { IC3DirectLineActivity } from '../../../types/ic3/IC3DirectLineActivity';
import createPatchFromRoleAndNameMiddleware from './createPatchFromRoleAndNameMiddleware';
import createSubscribeNewMessageAndThreadUpdateEnhancer from './subscribeNewMessageAndThreadUpdate';

export default function createIngressEnhancer(): AdapterEnhancer<IC3DirectLineActivity, IC3AdapterState> {
  return compose(
    createSubscribeNewMessageAndThreadUpdateEnhancer(),
    applyIngressMiddleware<IC3DirectLineActivity, IC3AdapterState>(createPatchFromRoleAndNameMiddleware())
  );
}
