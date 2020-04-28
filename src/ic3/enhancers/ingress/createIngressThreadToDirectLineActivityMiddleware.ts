/// <reference path="../../../types/ic3/external/Model.d.ts" />

import { ActivityMessageThread } from '../../../types/ic3/ActivityMessageThread';
import { ActivityType, SenderRole } from '../../../types/DirectLineTypes';
import { IC3_CHANNEL_ID } from '../../Constants';
import { IC3AdapterState } from '../../../types/ic3/IC3AdapterState';
import { IngressMiddleware } from '../../../applyIngressMiddleware';
import uniqueId from '../../utils/uniqueId';

export default function createIngressThreadToDirectLineActivityEnhancer(
  conversation: Microsoft.CRM.Omnichannel.IC3Client.Model.IConversation
): IngressMiddleware<ActivityMessageThread, IC3AdapterState> {
  return () => next => (activityMessageThread: ActivityMessageThread) => {
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
