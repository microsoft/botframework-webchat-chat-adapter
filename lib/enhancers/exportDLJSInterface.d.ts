/// <reference path="../../src/types/external.d.ts" />
import Observable from 'core-js/features/observable';
import { AdapterState, AdapterEnhancer } from '../types/AdapterTypes';
import { IDirectLineActivity } from '../types/DirectLineTypes';
export declare enum ConnectionStatus {
    Uninitialized = 0,
    Connecting = 1,
    Connected = 2,
    FailedToConnect = 4
}
export interface IDirectLineJS {
    activity$: Observable<IDirectLineActivity>;
    connectionStatus$: Observable<ConnectionStatus>;
    end: () => void;
    postActivity: (activity: IDirectLineActivity) => Observable<string>;
}
export default function exportDLJSInterface<TAdapterState extends AdapterState>(): AdapterEnhancer<IDirectLineActivity, TAdapterState>;
