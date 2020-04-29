/// <reference path="../types/ic3/external/Model.d.ts" />

import { compose } from 'redux';

import { AdapterCreator, AdapterEnhancer, ReadyState } from '../types/AdapterTypes';
import { HostType } from '../types/ic3/HostType';
import { IC3AdapterState, StateKey } from '../types/ic3/IC3AdapterState';
import { IC3DirectLineActivity } from '../types/ic3/IC3DirectLineActivity';
import { IIC3AdapterOptions } from '../types/ic3/IIC3AdapterOptions';
import { ProtocolType } from '../types/ic3/ProtocolType';
import createEgressEnhancer from './enhancers/egress/index';
import createIngressEnhancer from './enhancers/ingress/index';
import getPlatformBotId from './utils/getPlatformBotId';
import initializeIC3SDK from './initializeIC3SDK';

export default function createIC3Enhancer({
  chatToken,
  hostType,
  logger,
  protocolType,
  sdkUrl,
  sdkURL,
  userDisplayName,
  userId,
  visitor
}: IIC3AdapterOptions & { sdkUrl?: string }): AdapterEnhancer<IC3DirectLineActivity, IC3AdapterState> {
  if (!chatToken) {
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

      adapter.setConfig(StateKey.BotId, undefined);
      adapter.setConfig(StateKey.Conversation, undefined);
      adapter.setConfig(StateKey.UserDisplayName, undefined);
      adapter.setConfig(StateKey.UserId, undefined);

      (async function () {
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

        const conversation = await sdk.joinConversation(chatToken.chatId);
        const botId = await getPlatformBotId(conversation);

        adapter.setConfig(StateKey.BotId, botId);
        adapter.setConfig(StateKey.Conversation, conversation);
        adapter.setConfig(StateKey.UserDisplayName, userDisplayName);
        adapter.setConfig(StateKey.UserId, userId);
        adapter.setReadyState(ReadyState.OPEN);
      })();

      return adapter;
    },
    createEgressEnhancer(),
    createIngressEnhancer()
  );
}
