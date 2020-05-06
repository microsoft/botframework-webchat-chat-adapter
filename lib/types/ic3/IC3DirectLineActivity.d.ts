/// <reference path="../../../src/types/ic3/external/Model.d.ts" />
import { IDirectLineActivity } from '../DirectLineTypes';
export declare type IC3DirectLineActivity = IDirectLineActivity & {
    channelData?: {
        deliveryMode?: Microsoft.CRM.Omnichannel.IC3Client.Model.DeliveryMode & string;
        members?: any[];
        middlewareData?: {
            [name: string]: string;
        };
        properties?: any;
        tags?: string[];
        type?: string;
        uploadFileMetadata: any;
    };
};
