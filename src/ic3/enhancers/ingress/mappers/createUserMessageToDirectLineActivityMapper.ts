/// <reference path="../../../../types/ic3/external/Model.d.ts" />

import { ActivityType, IDirectLineActivity, SuggestedActions } from '../../../../types/DirectLineTypes';
import { IC3AdapterState, StateKey } from '../../../../types/ic3/IC3AdapterState';

import { AsyncMapper } from '../../../../types/ic3/AsyncMapper';
import { GetStateFunction } from '../../../../types/AdapterTypes';
import { IC3DirectLineActivity } from '../../../../types/ic3/IC3DirectLineActivity';
import { IC3_CHANNEL_ID } from '../../../Constants';
import uniqueId from '../../../utils/uniqueId';
import { TelemetryEvents } from '../../../../types/ic3/TelemetryEvents';

const IMAGE_CONTENT_TYPES: { [type: string]: string } = {
  //image
  gif: 'image/gif',
  jpeg: 'image/jpeg',
  jpg: 'image/jpeg',
  png: 'image/png',
  jiff: 'image/jiff',
  bmp: 'image/bmp'
};

const AUDIO_CONTENT_TYPES: { [type: string]: string } = {
  //audio
  mp3: 'audio/mp3',
  aac: "audio/aac",
  aiff: "audio/aiff",
  alac: "audio/alac",
  flac: "audio/flac",
  mp2: "audio/mp2",
  pcm: "audio/pcm",
  wav: "audio/wav",
  wma: "audio/wma",
};

const VIDEO_CONTENT_TYPES: { [type: string]: string } = {
  //video
  mp4: 'video/mp4',
  avchd: "video/avchd",
  avi: "video/avi",
  flv: "video/flv",
  mpe: "video/mpe",
  mpeg: "video/mpeg",
  mpg: "video/mpg",
  mpv: "video/mpv",
  m4p: "video/m4p",
  m4v: "video/m4v",
  mov: "video/mov",
  qt: "video/qt",
  swf: "video/swf",
  webm: "video/webm",
  wmv: "video/wmv"
};

const SUPPORTED_CONTENT_TYPES: { [type: string]: string } = {
  ...IMAGE_CONTENT_TYPES, ...AUDIO_CONTENT_TYPES, ...VIDEO_CONTENT_TYPES
}

export default function createUserMessageToDirectLineActivityMapper({
  getState
}: {
  getState: GetStateFunction<IC3AdapterState>;
}): AsyncMapper<Microsoft.CRM.Omnichannel.IC3Client.Model.IMessage, IC3DirectLineActivity> {
  return next => async (message: Microsoft.CRM.Omnichannel.IC3Client.Model.IMessage) => {
    const logger = getState(StateKey.AdapterLogger);
    
    if (message.messageType !== Microsoft.CRM.Omnichannel.IC3Client.Model.MessageType.UserMessage) {
      logger.error(TelemetryEvents.CONVERSATION_NOT_FOUND, {
        Description: `Adapter: Failed to ingress without an active conversation.`
      });
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
      let contentType = 'application/octet-stream';
      if ( !!IMAGE_CONTENT_TYPES[type]) {
        contentType = IMAGE_CONTENT_TYPES[type];
      }else {
        if(getState(StateKey.FeatureConfig).ShouldEnableInlinePlaying){
          if ( !!AUDIO_CONTENT_TYPES[type]) {
            contentType = AUDIO_CONTENT_TYPES[type];
          }
          else if( !!VIDEO_CONTENT_TYPES[type]) {
            contentType = VIDEO_CONTENT_TYPES[type];
          }
        }
      }
      const patchedBlob = new Blob([blob], { type: contentType });
      const contentUrl = URL.createObjectURL(patchedBlob);

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
