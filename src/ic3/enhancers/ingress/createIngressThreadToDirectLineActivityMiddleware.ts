/// <reference path="../../../types/ic3/external/Model.d.ts" />

import { ActivityMessageThread } from '../../../types/ic3/ActivityMessageThread';
import { ActivityType, SenderRole } from '../../../types/DirectLineTypes';
import { IC3_CHANNEL_ID } from '../../Constants';
import { IC3AdapterState, StateKey } from '../../../types/ic3/IC3AdapterState';
import { IngressMiddleware } from '../../../applyIngressMiddleware';
import uniqueId from '../../utils/uniqueId';

export default function createIngressThreadToDirectLineActivityEnhancer(): IngressMiddleware<
  ActivityMessageThread,
  IC3AdapterState
> {
  return ({ getConfig }) => next => (activityMessageThread: ActivityMessageThread) => {
    const conversation: Microsoft.CRM.Omnichannel.IC3Client.Model.IConversation = getConfig(StateKey.Conversation);

    if (!conversation) {
      throw new Error('IC3: Failed to ingress without an active conversation.');
    }

    if (!('thread' in activityMessageThread)) {
      return next(activityMessageThread);
    }

    const {
      thread: { id, members, properties, type }
    } = activityMessageThread;

    return next({
      activity: {
        channelId: IC3_CHANNEL_ID,
        channelData: {
          members,
          properties,
          type
        },
        conversation: { id: conversation.id },
        from: {
          id,
          name,
          role: SenderRole.Channel
        },
        id: uniqueId(),
        timestamp: new Date().toISOString(),
        type: ActivityType.Message
      }
    });
  };
}
