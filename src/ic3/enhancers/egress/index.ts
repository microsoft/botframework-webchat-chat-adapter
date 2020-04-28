/// <reference path="../../../types/ic3/external/Model.d.ts" />

import { ActivityMessageThread } from '../../../types/ic3/ActivityMessageThread';
import { AdapterEnhancer } from '../../../types/AdapterTypes';
import { applyEgressMiddleware } from '../../..';
import { IC3AdapterState } from '../../../types/ic3/IC3AdapterState';
import createEgressMessageActivityMiddleware from './createEgressMessageActivityMiddleware';
import createEgressTypingActivityMiddleware from './createEgressTypingActivityMiddleware';

export default function createEgressEnhancer(
  conversation: Microsoft.CRM.Omnichannel.IC3Client.Model.IConversation
): AdapterEnhancer<ActivityMessageThread, IC3AdapterState> {
  return applyEgressMiddleware(
    createEgressMessageActivityMiddleware(conversation),
    createEgressTypingActivityMiddleware(conversation)
  );
}
