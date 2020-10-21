import createTypingMessageToDirectLineActivityMapper from './../../../../../src/ic3/enhancers/ingress/mappers/createThreadToDirectLineActivityMapper';
import { StateKey } from './../../../../../src/types/ic3/IC3AdapterState';
import { TelemetryEvents } from './../../../../../src/types/ic3/TelemetryEvents';
import { IC3_CHANNEL_ID } from './../../../../../src/ic3/Constants';
import { ActivityType, Role } from './../../../../../src/types/DirectLineTypes';
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
                            LogLevel: { DEBUG: 'DEBUG', ERROR: 'ERROR' }
                        }
                    }
                },
            }
        }
    });

    afterAll(() => {
        global.Microsoft = globalMicrosoftBefore;
    });

    test('should throw error when no conversation', async () => {
        const mockLogClientSdkTelemetryEvent = jest.fn();  
        const mockGetState = (key) => key === StateKey.Logger
            ? { logClientSdkTelemetryEvent: mockLogClientSdkTelemetryEvent }
            : null;
        try {
            await createTypingMessageToDirectLineActivityMapper({getState: mockGetState})()();
        } catch(e) {
            expect(mockLogClientSdkTelemetryEvent).toHaveBeenCalledWith('ERROR', {
                Event: TelemetryEvents.CONVERSATION_NOT_FOUND,
                Description: `Adapter: Failed to ingress thread update without an active conversation.`
            });
            expect(e).toEqual(new Error('IC3: Failed to ingress thread update without an active conversation.'))
        }
    });

    test('should return correct ic3 activity', async () => {
        spyOn(Date.prototype, 'toISOString').and.returnValue('dateString');
        spyOn(uniqueId, 'default').and.returnValue('uniqueId');

        const conversation = { id: 'convId' };
        const mockGetState = () => conversation;
        const thread = {
            id: 'threadId',
            members: 'members',
            properties: 'properties',
            type: 'type'
        };
        const result = await createTypingMessageToDirectLineActivityMapper({getState: mockGetState})()(thread);
        const expectedResult = {
            channelData: {
                members: thread.members,
                properties: thread.properties,
                type: thread.type
            },
            channelId: IC3_CHANNEL_ID,
            conversation,
            from: {
                id: thread.id,
                name: '',
                role: Role.Channel
            },
            id: 'uniqueId',
            timestamp: 'dateString',
            type: ActivityType.Message
        }
        expect(result).toEqual(expectedResult);
    });
});
