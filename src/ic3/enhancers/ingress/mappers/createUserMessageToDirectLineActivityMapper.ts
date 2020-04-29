/// <reference path="../../../../types/ic3/external/Model.d.ts" />

import { ActivityType, SuggestedActions } from '../../../../types/DirectLineTypes';
import { AsyncMapper } from '../../../../types/ic3/AsyncMapper';
import { GetStateFunction } from '../../../../types/AdapterTypes';
import { IC3_CHANNEL_ID } from '../../../Constants';
import { IC3AdapterState, StateKey } from '../../../../types/ic3/IC3AdapterState';
import { IC3DirectLineActivity } from '../../../../types/ic3/IC3DirectLineActivity';
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
    const conversation: Microsoft.CRM.Omnichannel.IC3Client.Model.IConversation = getState(StateKey.Conversation);

    if (!conversation) {
      throw new Error('IC3: Failed to ingress without an active conversation.');
    }

    if (message.messageType !== Microsoft.CRM.Omnichannel.IC3Client.Model.MessageType.UserMessage) {
      return next(message);
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
      const blob = await this.conversation.downloadFile(fileMetadata);
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

    const activity = {
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

    // // Adaptive Cards
    // if (content && content.includes(HTMLConstants.contentURIObject)) {
    //   const parser = new DOMParser();
    //   const xmlDoc = parser.parseFromString(content, HTMLConstants.contentTextXml);

    //   if (xmlDoc.getElementsByTagName(HTMLConstants.tagParseError).length > 0) {
    //     console.warn(`[AdaptiveCard] Unable to parse XML`);
    //     return activityData;
    //   }

    //   if (xmlDoc.documentElement.nodeName !== HTMLConstants.contentURIObject) {
    //     console.warn(`[AdaptiveCard] Wrong XML schema`);
    //     return activityData;
    //   }

    //   const swiftElement = xmlDoc.getElementsByTagName(HTMLConstants.tagSwift)[0];
    //   const base64Data: any = swiftElement.getAttribute(HTMLConstants.attributeB64);
    //   const data = this.b64DecodeUnicode(base64Data);

    //   if (!data) {
    //     console.warn(`[AdaptiveCard] Data is empty`);
    //     return activityData;
    //   }

    //   const jsonData = JSON.parse(data);
    //   const { type } = jsonData;

    //   // Check if it's adaptive card
    //   if (!type.includes(HTMLConstants.typeMessageCard)) {
    //     return activityData;
    //   }

    //   if (!jsonData[Constants.attachments]) {
    //     console.warn(`[AdaptiveCard] Key 'attachments' not found`);
    //     return activityData;
    //   }

    //   let _attachments = jsonData[Constants.attachments];
    //   try {
    //     _attachments = this.processAdaptiveCardAttachments(_attachments);
    //   } catch (a) {
    //     console.error('Failed to processing attachments: ', _attachments);
    //   }
    //   activityData.attachments = _attachments;
    //   activityData.text = '';
    // }

    return activity;
  };
}
