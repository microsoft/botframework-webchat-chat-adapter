import { FeatureConfig } from "./IIC3AdapterOptions";
import { IAdapterLogger } from "../../ic3/telemetry/IAdapterLogger";

enum StateKey {
  BotId = 'ic3.botId',
  Conversation = 'ic3.conversation',
  UserDisplayName = 'ic3.userDisplayName',
  UserId = 'ic3.userId',
  FeatureConfig = 'ic3.featureConfig',
  AdapterLogger = 'ic3.adapterLogger'
}

export { StateKey };

export type IC3AdapterState = {
  [StateKey.BotId]: string;
  [StateKey.Conversation]: any;
  [StateKey.UserDisplayName]: string;
  [StateKey.UserId]: string;
  [StateKey.FeatureConfig]: FeatureConfig;
  [StateKey.AdapterLogger]: IAdapterLogger;
};
