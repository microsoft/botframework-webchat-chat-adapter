/// <reference path="../../../types/ic3/external/Model.d.ts" />

import { compose } from 'redux';

import { ActivityMessageThread } from '../../../types/ic3/ActivityMessageThread';
import { AdapterEnhancer } from '../../../types/AdapterTypes';
import { applyIngressMiddleware } from '../../..';
import { IC3AdapterState } from '../../../types/ic3/IC3AdapterState';
import createIngressOverrideDirectLineFromFieldMiddleware from './createIngressOverrideDirectLineFromFieldMiddleware';
import createIngressThreadToDirectLineActivityMiddleware from './createIngressThreadToDirectLineActivityMiddleware';
import createIngressTypingMessageToDirectLineActivityMiddleware from './createIngressTypingMessageToDirectLineActivityMiddleware';
import createIngressUserMessageToDirectLineActivityMiddleware from './createIngressUserMessageToDirectLineActivityMiddleware';

export default function createEgressEnhancer(
  conversation: Microsoft.CRM.Omnichannel.IC3Client.Model.IConversation
): AdapterEnhancer<ActivityMessageThread, IC3AdapterState> {
  return applyIngressMiddleware<ActivityMessageThread, IC3AdapterState>(
    createIngressUserMessageToDirectLineActivityMiddleware(conversation),
    createIngressThreadToDirectLineActivityMiddleware(conversation),
    createIngressTypingMessageToDirectLineActivityMiddleware(conversation),
    createIngressOverrideDirectLineFromFieldMiddleware()
  );
}
