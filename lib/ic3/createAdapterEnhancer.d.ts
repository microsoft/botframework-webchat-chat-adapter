/// <reference path="../../src/types/ic3/external/Model.d.ts" />
import { AdapterEnhancer } from '../types/AdapterTypes';
import { IC3AdapterState } from '../types/ic3/IC3AdapterState';
import { IC3DirectLineActivity } from '../types/ic3/IC3DirectLineActivity';
import { IIC3AdapterOptions } from '../types/ic3/IIC3AdapterOptions';
export default function createIC3Enhancer({ chatToken, hostType, logger, protocolType, sdkUrl, sdkURL, userDisplayName, userId, visitor }: IIC3AdapterOptions & {
    sdkUrl?: string;
}): AdapterEnhancer<IC3DirectLineActivity, IC3AdapterState>;
