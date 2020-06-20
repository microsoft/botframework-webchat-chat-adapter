/// <reference path="./external/Model.d.ts" />

import { IChatToken } from './IChatToken';
import { INotification } from './INotification';

export interface IIC3AdapterOptions
  extends Microsoft.CRM.Omnichannel.IC3Client.Model.IClientSDKInitializationParameters {
  callbackOnNotification?: (notification: INotification) => void;
  chatToken: IChatToken;
  conversation?: Microsoft.CRM.Omnichannel.IC3Client.Model.IConversation;
  logger: Microsoft.CRM.Omnichannel.IC3Client.Model.ILogger;
  sdkURL?: string;
  userDisplayName?: string;
  userId: string;
  visitor?: boolean;
  sendHeartBeat: boolean;
}
