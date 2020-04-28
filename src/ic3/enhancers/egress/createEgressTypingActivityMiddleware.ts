/// <reference path="../../../types/ic3/external/Model.d.ts" />

import { ActivityMessageThread } from '../../../types/ic3/ActivityMessageThread';
import { ActivityType } from '../../../types/DirectLineTypes';
import { EgressMiddleware } from '../../../applyEgressMiddleware';
import { IC3AdapterState, StateKey } from '../../../types/ic3/IC3AdapterState';
import { IC3DirectLineActivity } from '../../../types/ic3/IC3DirectLineActivity';
import { MessageTag } from '../../../types/ic3/MessageTag';

const TYPING_INDICATOR_PAYLOAD = '{"isTyping":true}';

function isInternalActivity(activity: IC3DirectLineActivity): boolean {
  return activity.channelData && activity.channelData.tags && activity.channelData.tags.includes(MessageTag.Private);
}

export default function createEgressTypingActivityMiddleware(
  conversation: Microsoft.CRM.Omnichannel.IC3Client.Model.IConversation
): EgressMiddleware<ActivityMessageThread, IC3AdapterState> {
  return ({ getConfig }) => next => (activityMessageThread: ActivityMessageThread) => {
    if (!('activity' in activityMessageThread)) {
      return next(activityMessageThread);
    }

    const { activity } = activityMessageThread;

    if (activity.type !== ActivityType.Typing) {
      return next(activityMessageThread);
    }

    conversation.indicateTypingStatus(Microsoft.CRM.Omnichannel.IC3Client.Model.TypingStatus.Typing, {
      imdisplayname: getConfig(StateKey.UserDisplayName) || activity.from.name || ''
    });

    const botId = getConfig(StateKey.BotId);

    botId &&
      !isInternalActivity(activity) &&
      conversation.sendMessageToBot(botId, { payload: TYPING_INDICATOR_PAYLOAD });
  };
}
