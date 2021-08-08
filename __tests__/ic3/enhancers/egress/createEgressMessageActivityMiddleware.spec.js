import createEgressMessageActivityMiddleware from './../../../../src/ic3/enhancers/egress/createEgressMessageActivityMiddleware';
import { ActivityType } from './../../../../src/types/DirectLineTypes';
import { TelemetryEvents } from './../../../../src/types/ic3/TelemetryEvents';
import { StateKey } from './../../../../src/types/ic3/IC3AdapterState';

describe('test createEgressMessageActivityMiddleware', () => {
    let globalMicrosoftBefore;
    const testDateNowValue = 123
    const textContentType = 'Text';
    const testActivityId = 'testActivityId';
    const userPersonType = 0;
    const userMessageType = 0;
    const logClientSdkTelemetryEventSpy = jest.fn();
    const sendMessageMock = jest.fn();
    const sendFileMessageMock = jest.fn();
    const next = () => 'next';
    const mockGetState = (key) => {
        switch(key) {
            case StateKey.Conversation: {
                return {
                    sendMessage: sendMessageMock,
                    sendFileMessage: sendFileMessageMock
                }
            }
            case StateKey.UserDisplayName: return StateKey.UserDisplayName;
            case StateKey.Logger: return { logClientSdkTelemetryEvent: logClientSdkTelemetryEventSpy};
            default: return null
        }
    }

    beforeAll(() => {
        spyOn(Date, 'now').and.returnValue(testDateNowValue);
        globalMicrosoftBefore = global.Microsoft;
        global.Microsoft = {
            CRM: {
                Omnichannel: {
                    IC3Client: {
                        Model: {
                            LogLevel: { ERROR: 'ERROR', DEBUG: 'DEBUG' },
                            MessageContentType: { Text: textContentType },
                            MessageType: { UserMessage: userMessageType },
                            PersonType: { User: userPersonType },
                            DeliveryMode: { Bridged: 'Bridged' }
                        }
                    }
                },
            }
        }
    });

    afterAll(() => {
        global.Microsoft = globalMicrosoftBefore;
    });

    it('should return next', async () => {
        const activity = { type: ActivityType.Typing };
        const result = await createEgressMessageActivityMiddleware()({getState: () => ({})})(next)(activity);
        expect(result).toEqual(next());
    });

    it('should throw an error when no conversation', async () => {
        const activity = { type: ActivityType.Message };
        try {
            await createEgressMessageActivityMiddleware()({getState: () => null})(next)(activity);
        } catch(e) {        
            expect(e).toEqual(new Error('IC3: Failed to egress without an active conversation.'));
        }
    });

    it('should send correct text message', async () => {
        const activity = {
            type: ActivityType.Message,
            channelData: { deliveryMode: 'testMode' },
            from: { id: 'testFromId' },
            timestamp: 123
        };

        await createEgressMessageActivityMiddleware()({getState: mockGetState})(next)(activity);
        const expectedMessage = {
            clientmessageid: `${testDateNowValue}`,
            content: '',
            contentType: textContentType,
            deliveryMode: 'testMode',
            messageType: 0,
            properties: activity.channelData,
            sender: { displayName: StateKey.UserDisplayName, id: activity.from.id, type: 0 },
            tags: [],
            timestamp: new Date(activity.timestamp)
        }
        expect(logClientSdkTelemetryEventSpy).toHaveBeenCalledWith(
            'DEBUG',
            {
                Event: TelemetryEvents.SEND_MESSAGE_SUCCESS,
                Description: `Adapter: Successfully sent a message with clientmessageid ${testDateNowValue}`
            }
        );
        expect(sendMessageMock).toHaveBeenCalledWith(expectedMessage);
    });

    it('should send correct text message without tags', async () => {
        const activity = {
            type: ActivityType.Message,
            channelData: { clientActivityID: testActivityId },
            from: { id: 'testFromId' },
            timestamp: 123,
            value: {}
        };

        await createEgressMessageActivityMiddleware()({getState: mockGetState})(next)(activity);
        const expectedMessage = {
            clientmessageid: `${testDateNowValue}`,
            content: JSON.stringify(activity.value),
            contentType: textContentType,
            deliveryMode: 'Bridged',
            messageType: 0,
            properties: { deliveryMode: 'Bridged' },
            sender: { displayName: StateKey.UserDisplayName, id: activity.from.id, type: 0 },
            tags: ["client_activity_id:testActivityId"],
            timestamp: new Date(activity.timestamp)
        }
        expect(logClientSdkTelemetryEventSpy).toHaveBeenCalledWith(
            'DEBUG',
            {
                Event: TelemetryEvents.SEND_MESSAGE_SUCCESS,
                Description: `Adapter: Successfully sent a message with clientmessageid ${testDateNowValue}`
            }
        );
        expect(sendMessageMock).toHaveBeenCalledWith(expectedMessage);
    });

    it('should send correct text message with tags', async () => {
        const clientActivityId = 'client_activity_id:1'
        const activity = {
            type: ActivityType.Message,
            channelData: {
                clientActivityID: testActivityId,
                tags: [clientActivityId, 'testTag']
            },
            from: { id: 'testFromId' },
            timestamp: 123,
            value: {}
        };

        await createEgressMessageActivityMiddleware()({getState: mockGetState})(next)(activity);
        const expectedMessage = {
            clientmessageid: `${testDateNowValue}`,
            content: JSON.stringify(activity.value),
            contentType: textContentType,
            deliveryMode: 'Bridged',
            messageType: 0,
            properties: { deliveryMode: 'Bridged' },
            sender: { displayName: StateKey.UserDisplayName, id: activity.from.id, type: 0 },
            tags: ["client_activity_id:testActivityId", 'testTag'],
            timestamp: new Date(activity.timestamp)
        }
        expect(logClientSdkTelemetryEventSpy).toHaveBeenCalledWith(
            'DEBUG',
            {
                Event: TelemetryEvents.SEND_MESSAGE_SUCCESS,
                Description: `Adapter: Successfully sent a message with clientmessageid ${testDateNowValue}`
            }
        );
        expect(sendMessageMock).toHaveBeenCalledWith(expectedMessage);
    });

    it('should send correct file message', async () => {
        const clientActivityId = 'client_activity_id:1'
        const activity = {
            type: ActivityType.Message,
            channelData: {
                clientActivityID: testActivityId,
                tags: [clientActivityId, 'testTag'],
                uploadedFileMetadata: 'fileMetaData'
            },
            from: { id: 'testFromId' },
            timestamp: 123,
            value: {},
            previousClientActivityID: 'previousActivityId'
        };

        await createEgressMessageActivityMiddleware()({getState: mockGetState})(next)(activity);
        const expectedMessage = {
            clientmessageid: `${testDateNowValue}`,
            content: JSON.stringify(activity.value),
            contentType: textContentType,
            deliveryMode: 'Bridged',
            messageType: 0,
            properties: { deliveryMode: 'Bridged' },
            sender: { displayName: StateKey.UserDisplayName, id: activity.from.id, type: 0 },
            tags: ["client_activity_id:testActivityId", 'testTag', "previousClientActivityID:previousActivityId"],
            timestamp: new Date(activity.timestamp)
        }
        expect(logClientSdkTelemetryEventSpy).toHaveBeenCalledWith(
            'DEBUG',
            {
                Event: TelemetryEvents.SEND_FILE_SUCCESS,
                Description: `Adapter: Successfully sent a file with clientmessageid ${testDateNowValue}`
            }
        );
        expect(sendFileMessageMock).toHaveBeenCalledWith(activity.channelData.uploadedFileMetadata, expectedMessage);
    });
});
