/// <reference path="../../../types/ic3/external/Model.d.ts" />

import { ActivityMessageThread } from '../../../types/ic3/ActivityMessageThread';
import { ActivityType } from '../../../types/DirectLineTypes';
import { IC3_CHANNEL_ID } from '../../Constants';
import { IC3AdapterState, StateKey } from '../../../types/ic3/IC3AdapterState';
import { IngressMiddleware } from '../../../applyIngressMiddleware';
import uniqueId from '../../utils/uniqueId';

export default function createIngressTypingMessageToDirectLineActivityEnhancer(): IngressMiddleware<
  ActivityMessageThread,
  IC3AdapterState
> {
  return ({ getConfig }) => next => (activityMessageThread: ActivityMessageThread) => {
    const conversation: Microsoft.CRM.Omnichannel.IC3Client.Model.IConversation = getConfig(StateKey.Conversation);

    if (!conversation) {
      throw new Error('IC3: Failed to ingress without an active conversation.');
    }

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
