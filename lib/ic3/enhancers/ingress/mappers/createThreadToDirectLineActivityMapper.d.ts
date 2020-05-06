/// <reference path="../../../../../src/types/ic3/external/Model.d.ts" />
import { AsyncMapper } from '../../../../types/ic3/AsyncMapper';
import { GetStateFunction } from '../../../../types/AdapterTypes';
import { IC3AdapterState } from '../../../../types/ic3/IC3AdapterState';
import { IC3DirectLineActivity } from '../../../../types/ic3/IC3DirectLineActivity';
export default function createTypingMessageToDirectLineActivityMapper({ getState }: {
    getState: GetStateFunction<IC3AdapterState>;
}): AsyncMapper<Microsoft.CRM.Omnichannel.IC3Client.Model.IThread, IC3DirectLineActivity>;
