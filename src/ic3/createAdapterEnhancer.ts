/// <reference path="../types/ic3/external/Model.d.ts" />

import { AdapterCreator, AdapterEnhancer, ReadyState } from '../types/AdapterTypes';
import { IC3AdapterState, StateKey } from '../types/ic3/IC3AdapterState';

import { HostType } from '../types/ic3/HostType';
import { IC3DirectLineActivity } from '../types/ic3/IC3DirectLineActivity';
import { IIC3AdapterOptions } from '../types/ic3/IIC3AdapterOptions';
import { ProtocolType } from '../types/ic3/ProtocolType';
import { compose } from 'redux';
import createEgressEnhancer from './enhancers/egress/index';
import createIngressEnhancer from './enhancers/ingress/index';
import getPlatformBotId from './utils/getPlatformBotId';
import initializeIC3SDK from './initializeIC3SDK';
import { TelemetryEvents } from '../types/ic3/TelemetryEvents';

export default function createIC3Enhancer({
  chatToken,
  hostType,
  logger,
  protocolType,
  sdkUrl,
  sdkURL,
  userDisplayName,
  userId,
  visitor,
  sendHeartBeat = false,
  conversation,
  featureConfig
}: IIC3AdapterOptions & { sdkUrl?: string }): AdapterEnhancer<IC3DirectLineActivity, IC3AdapterState> {

  if (sdkUrl && !sdkURL) {
    console.warn(
      'IC3: "sdkUrl" has been renamed to "sdkURL". Please rename accordingly to suppress this warning in the future.'
    );
    sdkURL = sdkUrl;
  }

  hostType = hostType ?? HostType.IFrame;
  protocolType = protocolType ?? ProtocolType.IC3V1SDK;
  visitor = visitor ?? true;

  return compose(
    (next: AdapterCreator<IC3DirectLineActivity, IC3AdapterState>) => (options: IIC3AdapterOptions) => {
      const adapter = next(options);

      adapter.setState(StateKey.BotId, undefined);
      adapter.setState(StateKey.Conversation, undefined);
      adapter.setState(StateKey.UserDisplayName, undefined);
      adapter.setState(StateKey.UserId, undefined);
      adapter.setState(StateKey.FeatureConfig, undefined);
      adapter.setState(StateKey.Logger, undefined);
      adapter.setState(StateKey.Visitor, undefined);

      (async function () {
        if(!conversation){
          const sdk = await initializeIC3SDK(
            sdkURL,
            {
              hostType,
              protocolType,
              logger
            },
            {
              regionGtms: chatToken.regionGTMS,
              token: chatToken.token,
              visitor
            }
          );
          
          logger?.logClientSdkTelemetryEvent(Microsoft.CRM.Omnichannel.IC3Client.Model.LogLevel.DEBUG,
            { Event: TelemetryEvents.IC3_SDK_JOIN_CONVERSATION_STARTED, 
              Description: `Adapter: No conversation found; joining conversation`
            });
          conversation = await sdk.joinConversation(chatToken.chatId, sendHeartBeat);
          logger?.logClientSdkTelemetryEvent(Microsoft.CRM.Omnichannel.IC3Client.Model.LogLevel.DEBUG,
            { Event: TelemetryEvents.IC3_SDK_JOIN_CONVERSATION_SUCCESS, 
              Description: `Adapter: No conversation found; join conversation success`
            });
        }

        const botId = await getPlatformBotId(conversation);

        adapter.setState(StateKey.BotId, botId);
        adapter.setState(StateKey.Conversation, conversation);
        adapter.setState(StateKey.UserDisplayName, userDisplayName);
        adapter.setState(StateKey.UserId, userId);
        adapter.setState(StateKey.FeatureConfig, featureConfig);
        adapter.setState(StateKey.Logger, logger);
        adapter.setState(StateKey.Visitor, visitor);
        adapter.setReadyState(ReadyState.OPEN);
      })();

      return adapter;
    },
    createEgressEnhancer(),
    createIngressEnhancer()
  );
}
