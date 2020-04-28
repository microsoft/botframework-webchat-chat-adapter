/// <reference path="../../../types/ic3/external/Model.d.ts" />

import { EgressMiddleware } from '../../../applyEgressMiddleware';
import { IC3AdapterState, StateKey } from '../../../types/ic3/IC3AdapterState';
import { ActivityMessageThread } from '../../../types/ic3/ActivityMessageThread';

export default function createEgressTypingActivityMiddleware(): EgressMiddleware<
  ActivityMessageThread,
  IC3AdapterState
> {
  return ({ getConfig, ingress }) => next => async (activityMessageThread: ActivityMessageThread) => {
    const conversation: Microsoft.CRM.Omnichannel.IC3Client.Model.IConversation = getConfig(StateKey.Conversation);

    console.log('egress', { activityMessageThread, conversation });

    if (!conversation) {
      throw new Error('IC3: Failed to egress without an active conversation.');
    }

    if (!('activity' in activityMessageThread)) {
      return next(activityMessageThread);
    }

    const {
      activity: { channelData, from, text, timestamp, value }
    } = activityMessageThread;

    const deliveryMode = channelData.deliveryMode
      ? channelData.deliveryMode
      : Microsoft.CRM.Omnichannel.IC3Client.Model.DeliveryMode.Bridged;

    let content;

    // If the text is null, we check if the value object is available.
    // Assign text to be the value string.
    if (!text && value) {
      try {
        content = JSON.stringify(value);
      } catch (e) {}
    } else {
      content = text;
    }

    const message: Microsoft.CRM.Omnichannel.IC3Client.Model.IMessage = {
      // If text is still falsy, we set to empty string to avoid breaking IC3 SDK.
      content: content || '',
      contentType: Microsoft.CRM.Omnichannel.IC3Client.Model.MessageContentType.Text,
      deliveryMode: deliveryMode,
      messageType: Microsoft.CRM.Omnichannel.IC3Client.Model.MessageType.UserMessage,
      properties: {
        deliveryMode: deliveryMode + ''
      },
      sender: {
        displayName: getConfig(StateKey.UserDisplayName) || from.name || '',
        id: from.id,
        type: Microsoft.CRM.Omnichannel.IC3Client.Model.PersonType.User
      },
      timestamp: new Date(timestamp),
      tags: channelData.tags
    };

    conversation.sendMessage(message);
    ingress({ message });
  };
}
