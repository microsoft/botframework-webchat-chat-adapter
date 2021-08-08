import createTypingMessageToDirectLineActivityMapper from './../../../../../src/ic3/enhancers/ingress/mappers/createTypingMessageToDirectLineActivityMapper';
import { StateKey } from './../../../../../src/types/ic3/IC3AdapterState';
import { TelemetryEvents } from './../../../../../src/types/ic3/TelemetryEvents';
import { IC3_CHANNEL_ID } from './../../../../../src/ic3/Constants';
import { ActivityType } from './../../../../../src/types/DirectLineTypes';
import * as uniqueId from './../../../../../src/ic3/utils/uniqueId';

describe('createTypingMessageToDirectLineActivityMapper test', () => {
    let globalMicrosoftBefore;

    beforeAll(() => {
        globalMicrosoftBefore = global.Microsoft;
        global.Microsoft = {
            CRM: {
                Omnichannel: {
                    IC3Client: {
                        Model: {
                            LogLevel: { ERROR: 'ERROR' },
                            MessageType: { Typing: 'Typing', ClearTyping: 'ClearTyping'}
                        }
                    }
                },
            }
        }
    });

    afterAll(() => {
        global.Microsoft = globalMicrosoftBefore;
    });

    test('should return next', async () => {
        const next = () => 'next';
        const result = await createTypingMessageToDirectLineActivityMapper({})(next)({});
        expect(result).toBe(next());
    });

    test('should throw error when no conversation', async () => {
        const mockLogClientSdkTelemetryEvent = jest.fn();
        const getState = (key) => key === StateKey.Logger ? {logClientSdkTelemetryEvent: mockLogClientSdkTelemetryEvent} : null;
        const message = { messageType: 'Typing' };
        try {
            await createTypingMessageToDirectLineActivityMapper({ getState })()(message);
        } catch(e) {
            expect(mockLogClientSdkTelemetryEvent).toHaveBeenCalledWith('ERROR', {
                Event: TelemetryEvents.CONVERSATION_NOT_FOUND,
                Description: `Adapter: Failed to ingress typing without an active conversation.`
            });
            expect(e).toEqual(new Error('IC3: Failed to ingress typing without an active conversation.'));
        }
    });

    test('should return correct object', async () => {
        spyOn(Date.prototype, 'toISOString').and.returnValue('dateString');
        spyOn(uniqueId, 'default').and.returnValue('uniqueId');
        const conversation = { id: 'tesConvId' };
        const getState = () => conversation;
        const message = {
            messageType: 'Typing',
            timestamp: new Date(),
            sender: { displayName: 'displayName', id: 'senderId' }
        };
        const result = await createTypingMessageToDirectLineActivityMapper({ getState })()(message);
        const expectedResult = {
            channelId: IC3_CHANNEL_ID,
            conversation,
            from: { id: message.sender.id, name: message.sender.displayName },
            id: 'uniqueId',
            timestamp: 'dateString',
            type: ActivityType.Typing
        }
        expect(result).toEqual(expectedResult);
    });
});
