/// <reference path="../../../types/ic3/external/Model.d.ts" />

import { compose } from 'redux';

import { AdapterEnhancer } from '../../../types/AdapterTypes';
import { applyIngressMiddleware } from '../../..';
import { IC3AdapterState } from '../../../types/ic3/IC3AdapterState';
import { IC3DirectLineActivity } from '../../../types/ic3/IC3DirectLineActivity';
import createIngressOverrideDirectLineFromFieldMiddleware from './createIngressOverrideDirectLineFromFieldMiddleware';
import createSubscribeNewMessageAndThreadUpdateEnhancer from './subscribeNewMessageAndThreadUpdate';

export default function createEgressEnhancer(): AdapterEnhancer<IC3DirectLineActivity, IC3AdapterState> {
  return compose(
    createSubscribeNewMessageAndThreadUpdateEnhancer(),
    applyIngressMiddleware<IC3DirectLineActivity, IC3AdapterState>(createIngressOverrideDirectLineFromFieldMiddleware())
  );
}
