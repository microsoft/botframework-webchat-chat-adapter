/// <reference path="../../../types/ic3/external/Model.d.ts" />

import { ActivityMessageThread } from '../../../types/ic3/ActivityMessageThread';
import { ActivityType, IDirectLineActivity, SuggestedActions } from '../../../types/DirectLineTypes';
import { IC3_CHANNEL_ID } from '../../Constants';
import { IngressMiddleware } from '../../../applyIngressMiddleware';
import uniqueId from '../../utils/uniqueId';

type IC3AdapterOptions = {};

const SUPPORTED_CONTENT_TYPES: { [type: string]: string } = {
  gif: 'image/gif',
  jpeg: 'image/jpeg',
  jpg: 'image/jpeg',
  png: 'image/png'
};

export default function createEgressEnhancer(
  conversation: Microsoft.CRM.Omnichannel.IC3Client.Model.IConversation
): IngressMiddleware<ActivityMessageThread, IC3AdapterOptions> {
  return () => next => async (activityMessageThread: ActivityMessageThread) => {
    if (!('message' in activityMessageThread)) {
      return next(activityMessageThread);
    }

    const { message } = activityMessageThread;

    const {
      clientmessageid,
      content,
      fileMetadata,
      messageType,
      sender: { displayName: name, id },
      timestamp,
      tags,
      properties
    } = message;

    if (messageType !== Microsoft.CRM.Omnichannel.IC3Client.Model.MessageType.UserMessage) {
      return next(activityMessageThread);
    }

    let attachments: any[];

    if (fileMetadata) {
      const { type } = fileMetadata;
      const blob = await this.conversation.downloadFile(fileMetadata);
      const contentType = SUPPORTED_CONTENT_TYPES[type] || 'application/octet-stream';
      const contentUrl = URL.createObjectURL(blob);

      // TODO: I think we don't need the line below.
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

    // TODO: Is it a type problem?
    let suggestedActions: SuggestedActions;
    // let suggestedActions = (properties && properties.suggestedActions && properties.suggestedActions.actions) ? properties.suggestedActions : [];

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

    return next({ activity });
  };
}
