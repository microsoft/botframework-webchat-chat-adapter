/// <reference path="../../../../types/ic3/external/Model.d.ts" />

import { ActivityType, SenderRole } from '../../../../types/DirectLineTypes';
import { AsyncMapper } from '../../../../types/ic3/AsyncMapper';
import { GetStateFunction } from '../../../../types/AdapterTypes';
import { IC3_CHANNEL_ID } from '../../../Constants';
import { IC3AdapterState, StateKey } from '../../../../types/ic3/IC3AdapterState';
import { IC3DirectLineActivity } from '../../../../types/ic3/IC3DirectLineActivity';
import uniqueId from '../../../utils/uniqueId';

export default function createTypingMessageToDirectLineActivityMapper({
  getState
}: {
  getState: GetStateFunction<IC3AdapterState>;
}): AsyncMapper<Microsoft.CRM.Omnichannel.IC3Client.Model.IThread, IC3DirectLineActivity> {
  return () => async (thread: Microsoft.CRM.Omnichannel.IC3Client.Model.IThread) => {
    const conversation: Microsoft.CRM.Omnichannel.IC3Client.Model.IConversation = getState(StateKey.Conversation);

    if (!conversation) {
      throw new Error('IC3: Failed to ingress without an active conversation.');
    }

    const { id, members, properties, type } = thread;

    return {
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
        role: SenderRole.Channel
      },
      id: uniqueId(),
      timestamp: new Date().toISOString(),
      type: ActivityType.Message
    };
  };
}
