/// <reference path="../../../types/ic3/external/Model.d.ts" />

import { ActivityType } from '../../../types/DirectLineTypes';
import { IC3AdapterState } from '../../../types/ic3/IC3AdapterState';
import { IC3DirectLineActivity } from '../../../types/ic3/IC3DirectLineActivity';
import { IngressMiddleware } from '../../../applyIngressMiddleware';
import updateIn from 'simple-update-in';

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
  return () => next => (activity: IC3DirectLineActivity) => {
    if (activity.type !== ActivityType.Message) {
      return next(activity);
    }

    const { text = '' } = activity;

    if (!text || !text.includes(CONTENT_URI_OBJECT)) {
      return next(activity);
    }

    const xmlDoc = new DOMParser().parseFromString(text, CONTENT_TEXT_XML);

    if (xmlDoc.getElementsByTagName(TAG_PARSE_ERROR).length) {
      console.warn(`IC3: [AdaptiveCard] Unable to parse XML; ignoring attachment.`);

      return next(activity);
    }

    if (xmlDoc.documentElement.nodeName !== CONTENT_URI_OBJECT) {
      console.warn(`IC3: [AdaptiveCard] Wrong XML schema; ignoring attachment.`);

      return next(activity);
    }

    const swiftElement = xmlDoc.getElementsByTagName(TAG_SWIFT)[0];

    if (!swiftElement) {
      console.warn(`IC3: [AdaptiveCard] Did not contains <Swift>; ignoring attachment.`);

      return next(activity);
    }

    const base64 = swiftElement.getAttribute(ATTRIBUTE_B64);
    const swiftJSON = base64DecodeAsUnicode(base64);

    if (!swiftJSON) {
      console.warn(`IC3: [AdaptiveCard] Data is empty; ignoring attachment.`);

      return next(activity);
    }

    const swift: { attachments: any[]; type: string } = JSON.parse(swiftJSON);

    // TODO: Why use "includes" instead of string equal?
    // Check if it's adaptive card
    if (!swift.type.includes(TYPE_MESSAGE_CARD)) {
      return next(activity);
    }

    if (!swift.attachments) {
      console.warn(`IC3: [AdaptiveCard] Key 'attachments' not found; ignoring attachment.`);

      return next(activity);
    }

    let attachments: any[];

    try {
      attachments = processAdaptiveCardAttachments(swift.attachments);
    } catch (error) {
      console.warn('IC3: [AdaptiveCard] Failed to process attachments; ignoring attachment.', swift);

      return next(activity);
    }

    return next({
      ...activity,
      attachments,
      text: ''
    });
  };
}
