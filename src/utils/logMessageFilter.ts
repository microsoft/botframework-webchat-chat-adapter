import { ActivityType, IDirectLineActivity, Role, TwoWaySerializableComplex } from '../types/DirectLineTypes';

export interface LogDLActivity {
  attachmentsCount?: number;
  channelData?: TwoWaySerializableComplex;
  channelId: string;
  conversation: {
    id: string;
  };
  from: {
    role?: Role;
  };
  textLength?: number;
  id?: string;
  suggestedActionCount?: number;
  timestamp: string;
  type: ActivityType;
  hasValue?: boolean;
  messageid?: string;
  previousClientActivityID?: string;
}
export function logMessagefilter(message: IDirectLineActivity): string {
  let result = "Failed to stringify activity.";
  if(!message) {
    return result;
  }
  let logActivity: LogDLActivity = {
    attachmentsCount: message.attachments? message.attachments.length : 0,
    channelData: {
        tags: message.channelData?.tags,
        clientmessageid: message.channelData?.clientmessageid
    },
    channelId: message.channelId,
    conversation: {
      id: message.conversation?.id
    },
    from: {
      role: message.from?.role
    },
    textLength: message.text?.length ?? 0,
    id: message.id,
    suggestedActionCount: message.suggestedActions? message.suggestedActions.actions?.length: 0,
    timestamp: message.timestamp,
    type: message.type,
    hasValue: !!message.value,
    messageid: message.messageid,
    previousClientActivityID: message.previousClientActivityID
  };

  try {
    result = JSON.stringify(logActivity);
  } catch (error) {
    
  }
  return result;
}