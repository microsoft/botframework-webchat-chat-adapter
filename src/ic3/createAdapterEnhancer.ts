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
import createLogger from './telemetry/createLogger';
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
  const adapterLogger = createLogger(logger);

  if (!chatToken) {
    adapterLogger.error(TelemetryEvents.CHAT_TOKEN_NOT_FOUND, {
      Description: `Adapter: "chatToken" must be specified`
    });
    throw new Error('"chatToken" must be specified.');
  }

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
      adapter.setState(StateKey.AdapterLogger, undefined);

      (async function () {
        if(!conversation){
          adapterLogger.debug(TelemetryEvents.IC3_SDK_INITIALIZE_STARTED, {
            Description: `Adapter: No conversation found; initializing IC3 SDK`
          });
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
          adapterLogger.debug(TelemetryEvents.IC3_SDK_JOIN_CONVERSATION_STARTED, {
            Description: `Adapter: No conversation found; joinging conversation`
          });
          conversation = await sdk.joinConversation(chatToken.chatId, sendHeartBeat);
          adapterLogger.debug(TelemetryEvents.IC3_SDK_JOIN_CONVERSATION_SUCCESS, {
            Description: `Adapter: No conversation found; join conversation success`
          });
        }

        const botId = await getPlatformBotId(conversation);

        adapter.setState(StateKey.BotId, botId);
        adapter.setState(StateKey.Conversation, conversation);
        adapter.setState(StateKey.UserDisplayName, userDisplayName);
        adapter.setState(StateKey.UserId, userId);
        adapter.setState(StateKey.FeatureConfig, featureConfig);
        adapter.setState(StateKey.AdapterLogger, adapterLogger);
        adapter.setReadyState(ReadyState.OPEN);
      })();

      return adapter;
    },
    createEgressEnhancer(),
    createIngressEnhancer()
  );
}
