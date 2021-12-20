import { ActivityType } from './../../../../src/types/DirectLineTypes';
import { StateKey } from './../../../../src/types/ic3/IC3AdapterState';
import { TelemetryEvents } from './../../../../src/types/ic3/TelemetryEvents';
import createEgressTypingActivityMiddleware from './../../../../src/ic3/enhancers/egress/createEgressTypingActivityMiddleware';

describe('createEgressTypingActivityMiddleware test', () => {
    let globalMicrosoftBefore;
    const logClientSdkTelemetryEventSpy = jest.fn();
    const indicateTypingStatusMock = jest.fn();
    const sendMessageToBotMock = jest.fn();
    const next = () => 'next';
    const mockGetState = (key) => {
        switch(key) {
            case StateKey.Conversation: {
                return {
                    indicateTypingStatus: indicateTypingStatusMock,
                    sendMessageToBot: sendMessageToBotMock
                }
            }
            case StateKey.UserDisplayName: return StateKey.UserDisplayName;
            case StateKey.BotId: return [StateKey.BotId]
            case StateKey.Logger: return { logClientSdkTelemetryEvent: logClientSdkTelemetryEventSpy};
            default: return null
        }
    }

    beforeAll(() => {
        globalMicrosoftBefore = global.Microsoft;
        global.Microsoft = {
            CRM: {
                Omnichannel: {
                    IC3Client: {
                        Model: {
                            LogLevel: { DEBUG: 'DEBUG' },
                            TypingStatus: { Typing: 'Typing' }
                        }
                    }
                },
            }
        }
    });

    afterAll(() => {
        global.Microsoft = globalMicrosoftBefore;
    });

    test('should return next when activity type is not typing', () => {
        const result = createEgressTypingActivityMiddleware()({getState: mockGetState})(next)({});
        expect(result).toEqual(next());
    });

    test('should throw error when no conversationg', () => {
        const activity = { type: ActivityType.Typing }
        try {
            createEgressTypingActivityMiddleware()({getState: () => null})(next)(activity);
        } catch(e) {
            expect(e).toEqual(new Error('IC3: Failed to egress without an active conversation.'));
        }
    });

    test('should indicate typing status, send message to bot and log correct event', () => {
        const activity = {
            type: ActivityType.Typing,
            channelData: { tags: ['tag'] }
        }
        createEgressTypingActivityMiddleware()({getState: mockGetState})(next)(activity);
        expect(indicateTypingStatusMock).toHaveBeenCalledWith('Typing', {
            imdisplayname: StateKey.UserDisplayName
        });
        expect(sendMessageToBotMock).toHaveBeenCalledWith(StateKey.BotId, {
            payload: '{"isTyping":true}'
        });
        expect(logClientSdkTelemetryEventSpy).toHaveBeenCalledWith('DEBUG', {
            Event: TelemetryEvents.SEND_TYPING_SUCCESS,
            Description: `Adapter: Successfully sent a typing indication`,
            CustomProperties: expect.anything()
        });
    });
});
