/// <reference path="../../../types/ic3/external/Model.d.ts" />

import { ActivityType } from '../../../types/DirectLineTypes';
import { IC3AdapterState, StateKey } from '../../../types/ic3/IC3AdapterState';
import { IC3DirectLineActivity } from '../../../types/ic3/IC3DirectLineActivity';
import { IngressMiddleware } from '../../../applyIngressMiddleware';
import updateIn from 'simple-update-in';
import { TelemetryEvents } from '../../../types/ic3/TelemetryEvents';

const ADAPTIVE_CARD_ACTION_SUBMIT = 'Action.Submit';
const ADAPTIVE_CARD_ACTION_TYPE_MAP: { [id: string]: string } = {
  imback: 'imBack',
  messageback: 'messageBack',
  postback: 'postBack'
};

const ATTRIBUTE_B64 = 'b64';
const CONTENT_TEXT_XML: SupportedType = 'text/xml';
const CONTENT_URI_OBJECT = 'URIObject';
const RETURN_TRUTHY = () => true;
const TAG_PARSE_ERROR = 'parseerror';
const TAG_SWIFT = 'Swift';
const TYPE_MESSAGE_CARD = 'message/card';

function base64DecodeAsUnicode(base64: string) {
  // Going backwards: from bytestream, to percent-encoding, to original string.
  return decodeURIComponent(
    atob(base64)
      .split('')
      .map(char => `%${('00' + char.charCodeAt(0).toString(16)).slice(-2)}`)
      .join('')
  );
}

function isNullOrUndefined(o: any) {
  return typeof o === 'undefined' || o === null;
}

function processAdaptiveCardAttachments(attachments: any[]): any[] {
  // If buttons are attached to the card, the button types must be following
  // webchat pattern. eg. "ImBack" needs to be converted to "imBack"
  attachments = updateIn(
    attachments || [],
    [RETURN_TRUTHY, 'content', 'buttons', RETURN_TRUTHY, 'type'],
    (type: string) => ADAPTIVE_CARD_ACTION_TYPE_MAP[type.toLowerCase()]
  );

  // If actions are attached to the card and the action type is "Action.submit", a data
  // object must be available for holding the input information
  attachments = updateIn(
    attachments,
    [
      RETURN_TRUTHY,
      'content',
      'actions',
      RETURN_TRUTHY,
      ({ data, type }: { data: any; type: string }) => type === ADAPTIVE_CARD_ACTION_SUBMIT && isNullOrUndefined(data),
      'data'
    ],
    () => ({})
  );

  return attachments;
}

export default function createExtractAdaptiveCardMiddleware(): IngressMiddleware<IC3DirectLineActivity, IC3AdapterState> {
  return ({ getState }) => next => (activity: IC3DirectLineActivity) => {

    if (activity.type !== ActivityType.Message) {
      return next(activity);
    }

    const { text = '' } = activity;

    if (!text || !text.includes(CONTENT_URI_OBJECT)) {
      return next(activity);
    }

    const xmlDoc = new DOMParser().parseFromString(text, CONTENT_TEXT_XML);

    if (xmlDoc.getElementsByTagName(TAG_PARSE_ERROR).length) {
      getState(StateKey.Logger).logClientSdkTelemetryEvent(Microsoft.CRM.Omnichannel.IC3Client.Model.LogLevel.WARN,
        {
          Event: TelemetryEvents.ADAPTIVE_CARD_PROCESSING_ERROR,
          Description: `Adapter: [AdaptiveCard] Unable to parse XML; ignoring attachment.`
        }
      );

      return next(activity);
    }

    if (xmlDoc.documentElement.nodeName !== CONTENT_URI_OBJECT) {
      getState(StateKey.Logger).logClientSdkTelemetryEvent(Microsoft.CRM.Omnichannel.IC3Client.Model.LogLevel.WARN,
        {
          Event: TelemetryEvents.ADAPTIVE_CARD_PROCESSING_ERROR,
          Description: `Adapter: [AdaptiveCard] Wrong XML schema; ignoring attachment.`
        }
      );

      return next(activity);
    }

    const swiftElement = xmlDoc.getElementsByTagName(TAG_SWIFT)[0];

    if (!swiftElement) {
      getState(StateKey.Logger).logClientSdkTelemetryEvent(Microsoft.CRM.Omnichannel.IC3Client.Model.LogLevel.WARN,
        {
          Event: TelemetryEvents.ADAPTIVE_CARD_PROCESSING_ERROR,
          Description: `Adapter: [AdaptiveCard] Does not contain <Swift>; ignoring attachment.`
        }
      );

      return next(activity);
    }

    const base64 = swiftElement.getAttribute(ATTRIBUTE_B64);
    const swiftJSON = base64DecodeAsUnicode(base64);

    if (!swiftJSON) {
      getState(StateKey.Logger).logClientSdkTelemetryEvent(Microsoft.CRM.Omnichannel.IC3Client.Model.LogLevel.WARN,
        {
          Event: TelemetryEvents.ADAPTIVE_CARD_PROCESSING_ERROR,
          Description: `Adapter: [AdaptiveCard] Data is empty; ignoring attachment.`
        }
      );

      return next(activity);
    }

    const swift: { attachments: any[]; type: string } = JSON.parse(swiftJSON);

    // TODO: Why use "includes" instead of string equal?
    // Check if it's adaptive card
    if (!swift.type.includes(TYPE_MESSAGE_CARD)) {
      return next(activity);
    }

    if (!swift.attachments) {
      getState(StateKey.Logger).logClientSdkTelemetryEvent(Microsoft.CRM.Omnichannel.IC3Client.Model.LogLevel.WARN,
        {
          Event: TelemetryEvents.ADAPTIVE_CARD_PROCESSING_ERROR,
          Description: `Adapter: [AdaptiveCard] Key 'attachments' not found; ignoring attachment.`
        }
      );

      return next(activity);
    }

    let attachments: any[];

    try {
      attachments = processAdaptiveCardAttachments(swift.attachments);
    } catch (error) {
      getState(StateKey.Logger).logClientSdkTelemetryEvent(Microsoft.CRM.Omnichannel.IC3Client.Model.LogLevel.ERROR,
        {
          Event: TelemetryEvents.ADAPTIVE_CARD_PROCESSING_ERROR,
          Description: `Adapter: [AdaptiveCard] Failed to process attachments; ignoring attachment.`,
          ExceptionDetails: error
        }
      );

      return next(activity);
    }

    return next({
      ...activity,
      attachments,
      text: ''
    });
  };
}
