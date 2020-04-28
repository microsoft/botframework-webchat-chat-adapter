/// <reference path="../../../types/ic3/external/Model.d.ts" />

import { ActivityMessageThread } from '../../../types/ic3/ActivityMessageThread';
import { ActivityType, IDirectLineActivity } from '../../../types/DirectLineTypes';
import { IC3_CHANNEL_ID } from '../../Constants';
import { IC3AdapterState } from '../../../types/ic3/IC3AdapterState';
import { IngressMiddleware } from '../../../applyIngressMiddleware';
import uniqueId from '../../utils/uniqueId';

export default function createIngressTypingMessageToDirectLineActivityEnhancer(
  conversation: Microsoft.CRM.Omnichannel.IC3Client.Model.IConversation
): IngressMiddleware<ActivityMessageThread, IC3AdapterState> {
  return () => next => (activityMessageThread: ActivityMessageThread) => {
    if (!('message' in activityMessageThread)) {
      return next(activityMessageThread);
    }

    const { message } = activityMessageThread;

    if (message.messageType !== Microsoft.CRM.Omnichannel.IC3Client.Model.MessageType.Typing) {
      return next(activityMessageThread);
    }

    const {
      sender: { displayName: name, id },
      timestamp
    } = message;

    return next({
      activity: {
        channelId: IC3_CHANNEL_ID,
        conversation: { id: conversation.id },
        from: {
          id,
          name
        },
        id: uniqueId(),
        timestamp: timestamp.toISOString(),
        type: ActivityType.Typing
      }
    });
  };
}
