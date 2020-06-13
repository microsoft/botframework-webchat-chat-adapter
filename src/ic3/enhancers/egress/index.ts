/// <reference path="../../../types/ic3/external/Model.d.ts" />

import { AdapterEnhancer } from '../../../types/AdapterTypes';
import { IC3AdapterState } from '../../../types/ic3/IC3AdapterState';
import { IC3DirectLineActivity } from '../../../types/ic3/IC3DirectLineActivity';
import { applyEgressMiddleware } from '../../..';
import createEgressFileAttachmentMiddleware from './createEgressFileAttachmentMiddleware';
import createEgressMessageActivityMiddleware from './createEgressMessageActivityMiddleware';
import createEgressTypingActivityMiddleware from './createEgressTypingActivityMiddleware';

export default function createEgressEnhancer(): AdapterEnhancer<IC3DirectLineActivity, IC3AdapterState> {
  return applyEgressMiddleware(
    createEgressFileAttachmentMiddleware(),
    createEgressMessageActivityMiddleware(),
    createEgressTypingActivityMiddleware()
  );
}
