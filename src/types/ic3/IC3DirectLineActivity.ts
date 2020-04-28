/// <reference path="./external/Model.d.ts" />

import { IDirectLineActivity } from '../DirectLineTypes';

export type IC3DirectLineActivity = IDirectLineActivity & {
  channelData?: {
    deliveryMode?: Microsoft.CRM.Omnichannel.IC3Client.Model.DeliveryMode;
    members?: any[];
    properties?: any;
    tags?: string[];
    type?: string;
  };
};
