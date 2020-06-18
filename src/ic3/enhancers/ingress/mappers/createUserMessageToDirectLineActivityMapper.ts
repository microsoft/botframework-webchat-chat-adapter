/// <reference path="../../../../types/ic3/external/Model.d.ts" />

import { ActivityType, IDirectLineActivity, SuggestedActions } from '../../../../types/DirectLineTypes';
import { IC3AdapterState, StateKey } from '../../../../types/ic3/IC3AdapterState';

import { AsyncMapper } from '../../../../types/ic3/AsyncMapper';
import { GetStateFunction } from '../../../../types/AdapterTypes';
import { IC3DirectLineActivity } from '../../../../types/ic3/IC3DirectLineActivity';
import { IC3_CHANNEL_ID } from '../../../Constants';
import uniqueId from '../../../utils/uniqueId';

const SUPPORTED_CONTENT_TYPES: { [type: string]: string } = {
  gif: 'image/gif',
  jpeg: 'image/jpeg',
  jpg: 'image/jpeg',
  png: 'image/png'
};

export default function createUserMessageToDirectLineActivityMapper({
  getState
}: {
  getState: GetStateFunction<IC3AdapterState>;
}): AsyncMapper<Microsoft.CRM.Omnichannel.IC3Client.Model.IMessage, IC3DirectLineActivity> {
  return next => async (message: Microsoft.CRM.Omnichannel.IC3Client.Model.IMessage) => {
    console.log("processing IC3 client message: ", message);
    if (message.messageType !== Microsoft.CRM.Omnichannel.IC3Client.Model.MessageType.UserMessage) {
      return next(message);
    }
    const conversation: Microsoft.CRM.Omnichannel.IC3Client.Model.IConversation = getState(StateKey.Conversation);

    if (!conversation) {
      throw new Error('IC3: Failed to ingress without an active conversation.');
    }

    const {
      clientmessageid,
      content,
      fileMetadata,
      properties,
      sender: { displayName: name, id },
      tags,
      timestamp
    } = message;

    let attachments: any[];

    if (fileMetadata) {
      const { type } = fileMetadata;
      const blob = await conversation.downloadFile(fileMetadata);
      const contentType = SUPPORTED_CONTENT_TYPES[type] || 'application/octet-stream';
      const contentUrl = URL.createObjectURL(blob);

      // TODO: I think we don't need the line below. Web Chat should fallback to contentUrl if we don't set the thumbnailUrl for images.
      const thumbnailUrl = type in SUPPORTED_CONTENT_TYPES ? contentUrl : undefined;

      attachments = [
        {
          ...fileMetadata,
          contentType,
          contentUrl,
          thumbnailUrl,
          // `contentUrl` has to be renamed to `tempContentUrl`. Otherwise because it is a blob URI, it is patched out by packages/core/src/reducers/activities.js (see link)
          // https://github.com/microsoft/BotFramework-WebChat/blob/89bf57a500c50ed4b377f05e4bb0aaeea9e11586/packages/core/src/reducers/activities.js#L35-L39
          tempContentUrl: contentUrl
        }
      ];
    }

    // TODO: Is it a type problem in IMessage? Try the commented line below, it failed typings.
    // let suggestedActions = (properties && properties.suggestedActions && properties.suggestedActions.actions) ? properties.suggestedActions : [];
    let suggestedActions: SuggestedActions =
      properties && properties.suggestedActions && (properties.suggestedActions as any).actions
        ? (properties.suggestedActions as any)
        : undefined;

    const activity: IDirectLineActivity = {
      attachments,
      channelId: IC3_CHANNEL_ID,
      channelData: {
        tags,
        clientmessageid
      },
      conversation: { id: conversation.id },
      from: {
        id,
        name
      },
      id: uniqueId(),
      suggestedActions,
      text: content,
      timestamp: timestamp.toISOString(),
      type: ActivityType.Message
    };
    return activity;
  };
}
