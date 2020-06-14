/// <reference path="../../../types/ic3/external/Model.d.ts" />

import { IC3AdapterState, StateKey } from '../../../types/ic3/IC3AdapterState';

import { ActivityType } from '../../../types/DirectLineTypes';
import { EgressMiddleware } from '../../../applyEgressMiddleware';
import { IC3DirectLineActivity } from '../../../types/ic3/IC3DirectLineActivity';
import { activityMap } from '../../utils/helper'
import uniqueId from '../../utils/uniqueId';

export default function createEgressMessageActivityMiddleware(): EgressMiddleware<
  IC3DirectLineActivity,
  IC3AdapterState
> {
  return ({ getState, ingress }) => next => async (activity: IC3DirectLineActivity) => {
    if (activity.type !== ActivityType.Message) {
      return next(activity);
    }
    activity.text = activity.text;
    console.log("calling egressMessageActivityMiddleware: ", {...activity});
    activity.id = uniqueId(); //added unique id: 

    const conversation: Microsoft.CRM.Omnichannel.IC3Client.Model.IConversation = getState(StateKey.Conversation);

    if (!conversation) {
      throw new Error('IC3: Failed to egress without an active conversation.');
    }
    console.log("current conversation: ", conversation);

    const { channelData, from, text, timestamp, value } = activity;
    const deliveryMode = channelData.deliveryMode || Microsoft.CRM.Omnichannel.IC3Client.Model.DeliveryMode.Bridged;
    let uniqueClientMessageId = new Date().getTime() + '';
    // If the text is null, we check if the value object is available.
    // Assign text to be the value string.
    // If text is still falsy, we set to empty string to avoid breaking IC3 SDK.
    const content = !text && value ? JSON.stringify(value) : text || '';
    const message: Microsoft.CRM.Omnichannel.IC3Client.Model.IMessage = {
      content,
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
      tags: channelData.tags,
      clientmessageid: uniqueClientMessageId
    };

    activityMap.set(uniqueClientMessageId, activity);
    console.log("activity to send out: ", JSON.stringify(activity), " activity: ", activity);
    console.log("message to send out: ", message);

    if (channelData.uploadedFileMetadata) {
      await conversation.sendFileMessage(
        (channelData.uploadedFileMetadata as unknown) as Microsoft.CRM.Omnichannel.IC3Client.Model.IFileMetadata,
        message
      );
    } else {
      await conversation.sendMessage(message);
    }

  // ingress({ ...activity, id: uniqueId() });
  };
}
