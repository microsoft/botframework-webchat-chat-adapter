/// <reference path="../../../../types/ic3/external/Model.d.ts" />

import { ActivityType, Role } from '../../../../types/DirectLineTypes';
import { IC3AdapterState, StateKey } from '../../../../types/ic3/IC3AdapterState';

import { AsyncMapper } from '../../../../types/ic3/AsyncMapper';
import { GetStateFunction } from '../../../../types/AdapterTypes';
import { IC3DirectLineActivity } from '../../../../types/ic3/IC3DirectLineActivity';
import { IC3_CHANNEL_ID } from '../../../Constants';
import uniqueId from '../../../utils/uniqueId';
import { TelemetryEvents } from '../../../../types/ic3/TelemetryEvents';

export default function createTypingMessageToDirectLineActivityMapper ({ getState }: { getState: GetStateFunction<IC3AdapterState>;}): 
AsyncMapper<Microsoft.CRM.Omnichannel.IC3Client.Model.IThread, IC3DirectLineActivity> 
{
  return () => async (thread: Microsoft.CRM.Omnichannel.IC3Client.Model.IThread) => {
    const conversation: Microsoft.CRM.Omnichannel.IC3Client.Model.IConversation = getState(StateKey.Conversation);

    if (!conversation) {
      getState(StateKey.Logger).logClientSdkTelemetryEvent(Microsoft.CRM.Omnichannel.IC3Client.Model.LogLevel.ERROR,
        {
          Event: TelemetryEvents.CONVERSATION_NOT_FOUND,
          Description: `Adapter: Failed to ingress without an active conversation.`
        }
      );
      throw new Error('IC3: Failed to ingress without an active conversation.');
    }

    const { id, members, properties, type } = thread;
    let ic3activity: IC3DirectLineActivity = {
      channelId: IC3_CHANNEL_ID,
      channelData: {
        members,
        properties,
        type
      },
      conversation: { id: conversation.id },
      from: {
        id,
        name,
        role: Role.Channel
      },
      id: uniqueId(),
      timestamp: new Date().toISOString(),
      type: ActivityType.Message,
    };
    return ic3activity;
  };
}
