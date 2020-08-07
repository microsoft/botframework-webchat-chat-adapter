import { FeatureConfig } from "./IIC3AdapterOptions";

enum StateKey {
  BotId = 'ic3.botId',
  Conversation = 'ic3.conversation',
  UserDisplayName = 'ic3.userDisplayName',
  UserId = 'ic3.userId',
  FeatureConfig = 'ic3.featureConfig',
  Logger = 'ic3.logger'
}

export { StateKey };

export type IC3AdapterState = {
  [StateKey.BotId]: string;
  [StateKey.Conversation]: any;
  [StateKey.UserDisplayName]: string;
  [StateKey.UserId]: string;
  [StateKey.FeatureConfig]: FeatureConfig;
  [StateKey.Logger]: Microsoft.CRM.Omnichannel.IC3Client.Model.ILogger;
};
