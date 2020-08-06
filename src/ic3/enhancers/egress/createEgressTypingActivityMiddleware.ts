/// <reference path="../../../types/ic3/external/Model.d.ts" />

import { IC3AdapterState, StateKey } from '../../../types/ic3/IC3AdapterState';

import { ActivityType } from '../../../types/DirectLineTypes';
import { EgressMiddleware } from '../../../applyEgressMiddleware';
import { IC3DirectLineActivity } from '../../../types/ic3/IC3DirectLineActivity';
import { MessageTag } from '../../../types/ic3/MessageTag';
import { TelemetryEvents } from '../../../types/ic3/TelemetryEvents';

const TYPING_INDICATOR_PAYLOAD = '{"isTyping":true}';

function isInternalActivity(activity: IC3DirectLineActivity): boolean {
  return activity.channelData && activity.channelData.tags && activity.channelData.tags.includes(MessageTag.Private);
}

export default function createEgressTypingActivityMiddleware(): EgressMiddleware<
  IC3DirectLineActivity,
  IC3AdapterState
> {
  return ({ getState }) => next => (activity: IC3DirectLineActivity) => {
    
    if (activity.type !== ActivityType.Typing) {
      return next(activity);
    }

    const conversation: Microsoft.CRM.Omnichannel.IC3Client.Model.IConversation = getState(StateKey.Conversation);

    if (!conversation) {
      throw new Error('IC3: Failed to egress without an active conversation.');
    }

    conversation.indicateTypingStatus(Microsoft.CRM.Omnichannel.IC3Client.Model.TypingStatus.Typing, {
      imdisplayname: getState(StateKey.UserDisplayName) || activity.from.name || ''
    });

    const botId = getState(StateKey.BotId);

    botId &&
      !isInternalActivity(activity) &&
      conversation.sendMessageToBot(botId, { payload: TYPING_INDICATOR_PAYLOAD });

    getState(StateKey.Logger).logClientSdkTelemetryEvent(Microsoft.CRM.Omnichannel.IC3Client.Model.LogLevel.DEBUG,
      {
        Event: TelemetryEvents.SEND_TYPING_SUCCESS,
        Description: `Adapter: Successfully sent a typing indication`
      }
    );
  };
}
