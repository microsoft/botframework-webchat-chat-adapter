import * as applySetStateMiddleware from './../../../../src/applySetStateMiddleware';
import * as createThreadToDirectLineActivityMapper from './../../../../src/ic3/enhancers/ingress/mappers/createThreadToDirectLineActivityMapper';
import * as redux from 'redux';

import ConnectivityManager from './../../../../src/ic3/utils/ConnectivityManager';
import { ReadyState } from './../../../../src/types/AdapterTypes';
import { StateKey } from './../../../../src/types/ic3/IC3AdapterState';
import { TelemetryEvents } from './../../../../src/types/ic3/TelemetryEvents';
import createSubscribeNewMessageAndThreadUpdateEnhancer from './../../../../src/ic3/enhancers/ingress/subscribeNewMessageAndThreadUpdate';

describe('createSubscribeNewMessageAndThreadUpdateEnhancer test', () => {
    let globalMicrosoftBefore;
    let windowAddEventListenerBefore;
    const mockLogClientSdkTelemetryEvent = jest.fn();
    const subscribe = subscriber => { subscriber.subscribe()}
    applySetStateMiddleware.default = (param) => param;
    const next = jest.fn();
    beforeAll(() => {
        jest.useFakeTimers();
        windowAddEventListenerBefore = window.addEventListener;
        globalMicrosoftBefore = global.Microsoft;
        window.addEventListener = jest.fn((param1, param2) => param2());
        redux.compose = () => param => { param() }
        createThreadToDirectLineActivityMapper.default = () => param => { param() }
        spyOn(redux, 'compose').and.callThrough();
        spyOn(createThreadToDirectLineActivityMapper, 'default').and.callThrough();
        global.Microsoft = {
            CRM: {
                Omnichannel: {
                    IC3Client: {
                        Model: {
                            LogLevel: { 
                                WARN: 'WARN',
                                DEBUG: 'DEBUG',
                                INFO: 'INFO',
                                ERROR: 'ERROR'
                            },
                            IConversation: {}
                        }
                    }
                },
            }
        }
    });

    afterAll(() => {
        global.Microsoft = globalMicrosoftBefore;
        window.addEventListener = windowAddEventListenerBefore;
    });

    test('should make correct calls when isInternetConnected is true, getReadyState is open', async () => {
        spyOn(ConnectivityManager, 'isInternetConnected').and.returnValue(true);
        const conversation = {
            getMessages: () => ['message1', 'mmesage2'],
            registerOnNewMessage: (param) => { param() },
            registerOnThreadUpdate: (param) => { param() }
        }
        const getState = (key) => {
            switch(key) {
                case StateKey.Logger: return {
                    logClientSdkTelemetryEvent: mockLogClientSdkTelemetryEvent
                }
                case StateKey.ConnectionStatusObserverReady: return 'ConnectionStatusObserverReady';
                default: return null;
            }
        }
        await createSubscribeNewMessageAndThreadUpdateEnhancer()({
            getState,
            subscribe,
            getReadyState: () => ReadyState.OPEN
        })(next)(StateKey.Conversation, conversation);
        expect(window.addEventListener).toHaveBeenCalledWith('reinitialize', expect.any(Function));
        expect(mockLogClientSdkTelemetryEvent).toHaveBeenCalledWith('DEBUG', expect.anything());
        expect(mockLogClientSdkTelemetryEvent).toHaveBeenCalledWith('WARN', expect.anything());
        expect(redux.compose).toHaveBeenCalled();
    });

    test('should make correct calls when isInternetConnected is false, getReadyState is not open', async () => {
        spyOn(ConnectivityManager, 'isInternetConnected').and.returnValue(false);
        const conversation = {
            getMessages: () => ['message1', 'mmesage2'],
            registerOnNewMessage: (param) => { param() },
            registerOnThreadUpdate: (param) => { param() }
        }
        const getState = (key) => {
            switch(key) {
                case StateKey.Logger: return {
                    logClientSdkTelemetryEvent: mockLogClientSdkTelemetryEvent
                }
                default: return null;
            }
        }
        await createSubscribeNewMessageAndThreadUpdateEnhancer()({
            getState,
            subscribe,
            getReadyState: () => {}
        })(next)(StateKey.Conversation, conversation);
        // jest.runAllTimers();
        expect(mockLogClientSdkTelemetryEvent).toHaveBeenCalledWith('DEBUG', expect.anything());
        expect(mockLogClientSdkTelemetryEvent).toHaveBeenCalledWith('WARN', expect.anything());
        expect(window.addEventListener).toHaveBeenCalledWith('reinitialize', expect.any(Function));
        expect(redux.compose).toHaveBeenCalled();
    });
});
