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
  png: 'image/png',
  // temp comment out to revert the change for release 7.1
  // mp3: 'audio/mp3',
  // mp4: 'video/mp4'
};

export default function createUserMessageToDirectLineActivityMapper({
  getState
}: {
  getState: GetStateFunction<IC3AdapterState>;
}): AsyncMapper<Microsoft.CRM.Omnichannel.IC3Client.Model.IMessage, IC3DirectLineActivity> {
  return next => async (message: Microsoft.CRM.Omnichannel.IC3Client.Model.IMessage) => {
    if (message.messageType !== Microsoft.CRM.Omnichannel.IC3Client.Model.MessageType.UserMessage) {
      return next(message);
    }

    const conversation: Microsoft.CRM.Omnichannel.IC3Client.Model.IConversation = getState(StateKey.Conversation);
    
    if (!conversation) {
      throw new Error('IC3: Failed to ingress without an active conversation.');
    }
    
    const {
      messageid,
      clientmessageid,
      content,
      fileMetadata,
      properties,
      sender: { displayName: name, id },
      tags,
      timestamp,
      resourceType,
      messageType
    } = message;

    let attachments: any[];

    if (fileMetadata) {
      const { type } = fileMetadata;
      const blob = await conversation.downloadFile(fileMetadata);
      const contentType = SUPPORTED_CONTENT_TYPES[type] || 'application/octet-stream';
      // temp comment out to revert the change for release 7.1
      // const patchedBlob = new Blob([blob], { type: contentType });
      // const contentUrl = URL.createObjectURL(patchedBlob);
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
          tempContentUrl: contentUrl,
          blob
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
      id: message.clientmessageid ? message.clientmessageid : uniqueId(),
      suggestedActions,
      text: content,
      timestamp: timestamp.toISOString(),
      type: ActivityType.Message,
      messageid: messageid? messageid : ""
    };

    if(message.tags){
      let clientActivityTags = message.tags.filter(tag => tag.indexOf("client_activity_id:") !== -1);
      if(clientActivityTags[0]){
        activity.channelData.clientActivityID = clientActivityTags[0].replace("client_activity_id:", "");
      }
    }

    // const isUserMessage = (messageType === Microsoft.CRM.Omnichannel.IC3Client.Model.MessageType.UserMessage);
    // const isMessageUpdate = (resourceType === Microsoft.CRM.Omnichannel.IC3Client.Model.ResourceType.MessageUpdate)
    // if(isUserMessage && clientmessageid && !isMessageUpdate && activity.channelData.clientActivityID){
    //   return;
    // }

    return activity;
  };
}
