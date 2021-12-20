import { ActivityType, IDirectLineActivity, Role, TwoWaySerializableComplex } from '../types/DirectLineTypes';

import { Adapter } from '..';
import { AdapterState } from '../types/AdapterTypes';
import { StateKey } from '../types/ic3/IC3AdapterState';

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

export function getAdapterContextDetails(adapter: Adapter<IDirectLineActivity, AdapterState>): string {
  if (!adapter || !adapter.getState) return "";
  return stringifyHelper({
    adapterId: adapter.id,
    [StateKey.BotId]: adapter.getState(StateKey.BotId),
    [StateKey.ChatId]: adapter.getState(StateKey.ChatId),
    [StateKey.LiveworkItemId]: adapter.getState(StateKey.LiveworkItemId),
    [StateKey.UserId]: adapter.getState(StateKey.UserId)
  })
}

export function extendError(error: any): Object {
  let extendedError = {
    rawError: error,
    message: "",
    stack: ""
  };
  if (!error) return {extendedError};
  if (error?.stack) {
    extendedError.stack = error.stack;
  }
  if (error?.message) {
    extendedError.message = error.message;
  }
  return extendedError;
}

export function stringifyHelper(obj: any) {
  let result = "";
  try {
    if (typeof obj === "string") {
      return obj;
    }
    let tempResult = JSON.stringify(obj);
    if (tempResult !== undefined && tempResult !== null) {
      return tempResult;
    }
  }
  catch (e) {
    result = `Failed to stringify provided object: ${e?.message} stack: ${e?.stack}`
  }
  return result;
}