/// <reference path="../../../types/ic3/external/Model.d.ts" />

import { IC3AdapterState, StateKey } from '../../../types/ic3/IC3AdapterState';
import { getAdapterContextDetails, stringifyHelper } from '../../../utils/logMessageFilter';

import { ActivityType } from '../../../types/DirectLineTypes';
import { EgressMiddleware } from '../../../applyEgressMiddleware';
import { IC3DirectLineActivity } from '../../../types/ic3/IC3DirectLineActivity';
import { TelemetryEvents } from '../../../types/ic3/TelemetryEvents';
import { Translated } from '../../Constants';
import { alreadyAcked } from '../../../utils/ackedMessageMap';
import { compose } from 'redux';
import createTypingMessageToDirectLineActivityMapper from '../ingress/mappers/createThreadToDirectLineActivityMapper';
import createUserMessageToDirectLineActivityMapper from '../ingress/mappers/createUserMessageToDirectLineActivityMapper';

export default function createEgressMessageActivityMiddleware(): EgressMiddleware<
  IC3DirectLineActivity,
  IC3AdapterState
> {
  return (adapter) => next => async (activity: IC3DirectLineActivity) => {
    const {ingress, getState} = adapter;
    const convertMessage = compose(
      createUserMessageToDirectLineActivityMapper({ getState }),
      createTypingMessageToDirectLineActivityMapper({ getState })
    )((message: any) => {
      getState(StateKey.Logger)?.logClientSdkTelemetryEvent(Microsoft.CRM.Omnichannel.IC3Client.Model.LogLevel.WARN,
        {
          Event: TelemetryEvents.UNKNOWN_MESSAGE_TYPE,
          Description: `Adapter: Unknown message type; ignoring ack message ${message?.clientmessageid}`,
          CustomProperties: stringifyHelper({
            messageId: message?.clientmessageid,
            [StateKey.ChatId]: getState(StateKey.ChatId),
            [StateKey.LiveworkItemId]: getState(StateKey.LiveworkItemId)
          })
        }
      );
    });
    if (activity.type !== ActivityType.Message) {
      return next(activity);
    }

    const conversation: Microsoft.CRM.Omnichannel.IC3Client.Model.IConversation = getState(StateKey.Conversation);

    if (!conversation) {
      getState(StateKey.Logger)?.logClientSdkTelemetryEvent(Microsoft.CRM.Omnichannel.IC3Client.Model.LogLevel.ERROR,
        {
          Event: TelemetryEvents.CONVERSATION_NOT_FOUND,
          Description: `Adapter: Failed to egress without an active conversation.`,
          CustomProperties: stringifyHelper({
            [StateKey.ChatId]: getState(StateKey.ChatId),
            [StateKey.LiveworkItemId]: getState(StateKey.LiveworkItemId)
          })
        }
      );
      throw new Error('IC3: Failed to egress without an active conversation.');
    }

    const { channelData, from, text, timestamp, value } = activity;
    const deliveryMode = channelData.deliveryMode || Microsoft.CRM.Omnichannel.IC3Client.Model.DeliveryMode.Bridged;
    let uniqueClientMessageId = Date.now().toString();
    (activity as any).clientmessageid = uniqueClientMessageId;
    
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
      tags: channelData.tags ?? [],
      clientmessageid: uniqueClientMessageId
    };

    // attach client activity id tag
    if(activity.channelData && activity.channelData.clientActivityID){
      if(hasTargetTag(message, "client_activity_id:")){
        for(let index = 0; index < message.tags.length; index ++ ){
          if(message.tags[index].indexOf("client_activity_id:") > -1){
            message.tags[index] = "client_activity_id:" + activity.channelData.clientActivityID;
            break;
          }
        }
        if (activity.previousClientActivityID){
          message.tags.push("previousClientActivityID:" + activity.previousClientActivityID)
        }
      }else{
        message.tags.push("client_activity_id:" + activity.channelData.clientActivityID);
      }
    }

    if (channelData.uploadedFileMetadata) {
      await conversation.sendFileMessage(
        (channelData.uploadedFileMetadata as unknown) as Microsoft.CRM.Omnichannel.IC3Client.Model.IFileMetadata,
        message
      );
      getState(StateKey.Logger)?.logClientSdkTelemetryEvent(Microsoft.CRM.Omnichannel.IC3Client.Model.LogLevel.DEBUG,
        {
          Event: TelemetryEvents.SEND_FILE_SUCCESS,
          Description: `Adapter: Successfully sent a file with clientmessageid ${message.clientmessageid}`,
          CustomProperties: stringifyHelper({
            messageId: message?.clientmessageid,
            [StateKey.ChatId]: getState(StateKey.ChatId),
            [StateKey.LiveworkItemId]: getState(StateKey.LiveworkItemId)
          })
        }
      );
    } else {
      const response = await conversation.sendMessage(message);
      getState(StateKey.Logger)?.logClientSdkTelemetryEvent(Microsoft.CRM.Omnichannel.IC3Client.Model.LogLevel.DEBUG,
        {
          Event: TelemetryEvents.SEND_MESSAGE_SUCCESS,
          Description: `Adapter: Successfully sent a message with clientmessageid ${message.clientmessageid}, chat ID: ${getState(StateKey.ChatId)}, adapter ID: ${adapter?.id? adapter.id : ""}`,
          CustomProperties: stringifyHelper({
            messageId: message?.clientmessageid,
            [StateKey.ChatId]: getState(StateKey.ChatId),
            [StateKey.LiveworkItemId]: getState(StateKey.LiveworkItemId)
          })
        }
      );
      if (ingress && response?.status === 201 && response?.contextid && response?.clientmessageid && !hasTargetTag(message, Translated)) {
        const ackActivity:any = await convertMessage(message);
        ackActivity.channelData.clientActivityID = activity.channelData.clientActivityID;
        /**
         * set message to "sent" state only if polling has not fetched the message back yet
         */
        if (!alreadyAcked(message.clientmessageid)) {
          ingress(ackActivity);
        }
      }
    }
  };
}

function hasTargetTag(message: Microsoft.CRM.Omnichannel.IC3Client.Model.IMessage, key: string): boolean {
  if (!message || !message.tags || message.tags.length === 0 || !key) return false;
  let targetTags = message.tags.filter(tag => tag.indexOf(key) > -1);
  return targetTags.length > 0;
}