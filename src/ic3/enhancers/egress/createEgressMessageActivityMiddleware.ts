/// <reference path="../../../types/ic3/external/Model.d.ts" />

import { ActivityType } from '../../../types/DirectLineTypes';
import { EgressMiddleware } from '../../../applyEgressMiddleware';
import { IC3AdapterState, StateKey } from '../../../types/ic3/IC3AdapterState';
import { IC3DirectLineActivity } from '../../../types/ic3/IC3DirectLineActivity';

export default function createEgressMessageActivityMiddleware(): EgressMiddleware<
  IC3DirectLineActivity,
  IC3AdapterState
> {
  return ({ getState, ingress }) => next => (activity: IC3DirectLineActivity) => {
    const conversation: Microsoft.CRM.Omnichannel.IC3Client.Model.IConversation = getState(StateKey.Conversation);

    if (!conversation) {
      throw new Error('IC3: Failed to egress without an active conversation.');
    }

    if (activity.type !== ActivityType.Message) {
      return next(activity);
    }

    const { channelData, from, text, timestamp, value } = activity;

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
        displayName: getState(StateKey.UserDisplayName) || from.name || '',
        id: from.id,
        type: Microsoft.CRM.Omnichannel.IC3Client.Model.PersonType.User
      },
      timestamp: new Date(timestamp),
      tags: channelData.tags
    };

    conversation.sendMessage(message).then(() => {
      ingress(activity);
    });
  };
}
