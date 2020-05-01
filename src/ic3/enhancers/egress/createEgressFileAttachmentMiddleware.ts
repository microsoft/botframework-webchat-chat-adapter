/// <reference path="../../../types/ic3/external/Model.d.ts" />

import { ActivityType } from '../../../types/DirectLineTypes';
import { EgressMiddleware } from '../../../applyEgressMiddleware';
import { IC3AdapterState, StateKey } from '../../../types/ic3/IC3AdapterState';
import { IC3DirectLineActivity } from '../../../types/ic3/IC3DirectLineActivity';

export default function createEgressMessageActivityMiddleware(): EgressMiddleware<
  IC3DirectLineActivity,
  IC3AdapterState
> {
  return ({ getState }) => next => async (activity: IC3DirectLineActivity) => {
    if (activity.type !== ActivityType.Message || !(activity.attachments || []).length) {
      return next(activity);
    }

    const conversation: Microsoft.CRM.Omnichannel.IC3Client.Model.IConversation = getState(StateKey.Conversation);

    if (!conversation) {
      throw new Error('IC3: Failed to egress without an active conversation.');
    }

    const { attachments } = activity;
    const middlewareData: { [key: string]: string } = attachments.reduce(
      (final, { contentUrl, name }) => ({
        ...final,
        [name || '']: contentUrl
      }),
      {}
    );

    await Promise.all(
      attachments.map(async ({ contentType, contentUrl, name }) => {
        const res = await fetch(contentUrl);

        if (!res.ok) {
          throw new Error('IC3: Failed to fetch attachment to send.');
        }

        // See https://stackoverflow.com/a/43241922/198348 to use Blob instead of File to support IE11 and Edge.
        const blobPart = await res.blob();
        const file: any = new Blob([blobPart], { type: contentType });
        const now = new Date();

        file.name = name || '';
        file.lastModified = +now;
        file.lastModifiedDate = now.toISOString();

        const uploadedFileMetadata: any = await conversation.uploadFile(file as File);

        // uploadedFileMetadata && this.attachmentsSeen.add(uploadFileMetadata.id);

        const individualActivity: IC3DirectLineActivity = {
          ...activity,
          channelData: {
            ...activity.channelData,
            middlewareData,
            uploadedFileMetadata
          },
          type: ActivityType.Message,
          timestamp: now.toISOString()
        };

        // We will defer sending out the activity via another egress.
        next(individualActivity);
      })
    );

    // const { channelData, from, text, timestamp, value } = activity;
    // const deliveryMode = channelData.deliveryMode || Microsoft.CRM.Omnichannel.IC3Client.Model.DeliveryMode.Bridged;

    // // If the text is null, we check if the value object is available.
    // // Assign text to be the value string.
    // // If text is still falsy, we set to empty string to avoid breaking IC3 SDK.
    // const content = !text && value ? JSON.stringify(value) : text || '';
    // const message: Microsoft.CRM.Omnichannel.IC3Client.Model.IMessage = {
    //   content,
    //   contentType: Microsoft.CRM.Omnichannel.IC3Client.Model.MessageContentType.Text,
    //   deliveryMode: deliveryMode,
    //   messageType: Microsoft.CRM.Omnichannel.IC3Client.Model.MessageType.UserMessage,
    //   properties: {
    //     deliveryMode: deliveryMode + ''
    //   },
    //   sender: {
    //     displayName: getState(StateKey.UserDisplayName) || from.name || '',
    //     id: from.id,
    //     type: Microsoft.CRM.Omnichannel.IC3Client.Model.PersonType.User
    //   },
    //   timestamp: new Date(timestamp),
    //   tags: channelData.tags
    // };

    // conversation.sendMessage(message).then(() => {
    //   ingress(activity);
    // });
  };
}
