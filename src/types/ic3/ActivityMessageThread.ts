import { IC3DirectLineActivity } from './IC3DirectLineActivity';

export type ActivityMessageThread =
  | { activity: IC3DirectLineActivity }
  | {
      message: Microsoft.CRM.Omnichannel.IC3Client.Model.IMessage;
    }
  | {
      thread: Microsoft.CRM.Omnichannel.IC3Client.Model.IThread;
    };
