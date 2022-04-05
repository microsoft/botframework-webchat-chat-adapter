/// <reference path="../../../types/ic3/external/Model.d.ts" />

import { IC3AdapterState, StateKey } from '../../../types/ic3/IC3AdapterState';

import { ActivityType } from '../../../types/DirectLineTypes';
import { EgressMiddleware } from '../../../applyEgressMiddleware';
import { IC3DirectLineActivity } from '../../../types/ic3/IC3DirectLineActivity';
import { MessageTag } from '../../../types/ic3/MessageTag';
import { TelemetryEvents } from '../../../types/ic3/TelemetryEvents';
import { stringifyHelper } from '../../../utils/logMessageFilter';

const TYPING_INDICATOR_PAYLOAD = '{"isTyping":true}';

function isInternalActivity(activity: IC3DirectLineActivity): boolean {
  return activity.channelData && activity.channelData.tags && activity.channelData.tags.includes(MessageTag.Private);
}

function getTags(isInternalActivity: boolean): string {
  if (isInternalActivity)
  {
    return MessageTag.Private;
  }
  else {
    return "public";
  }
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
      imdisplayname: getState(StateKey.UserDisplayName) || activity.from.name || '',
      tag: getTags(isInternalActivity(activity))
    });

    const botIds = getState(StateKey.BotId);

    if (botIds && botIds.length && !isInternalActivity(activity)) {
      for (let i = 0; i < botIds.length; i++) {
        conversation.sendMessageToBot(botIds[i], { payload: TYPING_INDICATOR_PAYLOAD });
      }
    }

    getState(StateKey.Logger)?.logClientSdkTelemetryEvent(Microsoft.CRM.Omnichannel.IC3Client.Model.LogLevel.DEBUG,
      {
        Event: TelemetryEvents.SEND_TYPING_SUCCESS,
        Description: `Adapter: Successfully sent a typing indication`,
        CustomProperties: stringifyHelper({
          [StateKey.ChatId]: getState(StateKey.ChatId),
          [StateKey.LiveworkItemId]: getState(StateKey.LiveworkItemId)
        })
      }
    );
  };
}
