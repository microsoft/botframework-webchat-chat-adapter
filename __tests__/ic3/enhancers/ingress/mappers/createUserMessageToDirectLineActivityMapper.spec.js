import createUserMessageToDirectLineActivityMapper from './../../../../../src/ic3/enhancers/ingress/mappers/createUserMessageToDirectLineActivityMapper';
import { StateKey } from './../../../../../src/types/ic3/IC3AdapterState';
import { TelemetryEvents } from './../../../../../src/types/ic3/TelemetryEvents';
import { IC3_CHANNEL_ID } from './../../../../../src/ic3/Constants';
import { ActivityType } from './../../../../../src/types/DirectLineTypes';

describe('createUserMessageToDirectLineActivityMapper test', () => {
    let globalMicrosoftBefore;
    let globalURLBefore;
    beforeAll(() => {
        spyOn(Date.prototype, 'toISOString').and.returnValue('dateString');
        globalMicrosoftBefore = global.Microsoft;
        globalURLBefore = global.URL;
        global.URL.createObjectURL = jest.fn().mockReturnValue('objectUrl');
        global.Microsoft = {
            CRM: {
                Omnichannel: {
                    IC3Client: {
                        Model: {
                            LogLevel: { ERROR: 'ERROR' },
                            MessageType: { UserMessage: 'UserMessage' }
                        }
                    }
                },
            }
        }
    });

    afterAll(() => {
        global.Microsoft = globalMicrosoftBefore;
        global.URL = globalURLBefore;
    });

    test('should return next', async () => {
        const next = 'next';
        const result = await createUserMessageToDirectLineActivityMapper({getState: () => {}})(() => next)({});
        expect(result).toBe(next);
    });

    test('should throw error', async () => {
        const mockLogClientSdkTelemetryEvent = jest.fn();
        const message = { messageType : 'UserMessage' };
        const getState = (key) => key === StateKey.Logger ? { logClientSdkTelemetryEvent: mockLogClientSdkTelemetryEvent } : null;
        try {
            await createUserMessageToDirectLineActivityMapper({getState})()(message);
        } catch(e) {
            expect(e).toEqual(new Error('IC3: Failed to ingress message without an active conversation.'));
            expect(mockLogClientSdkTelemetryEvent).toHaveBeenCalledWith('ERROR', {
                Event: TelemetryEvents.CONVERSATION_NOT_FOUND,
                Description: `Adapter: Failed to ingress message without an active conversation.`
            });
        }
    });

    test('should return correct activity', async () => {
        const message = {
            messageType : 'UserMessage',
            messageid: 'messageid',
            clientmessageid: 'clientmessageid',
            content: 'content',
            properties: { fromUserId: 'fromUserId' },
            sender: { displayName: 'displayName', id: 'senderId' },
            timestamp: new Date()
        };
        const conversation = { id: 'conversationId' }
        const getState = () => conversation;
        const result = await createUserMessageToDirectLineActivityMapper({getState})()(message);
        const expectedResult = {
            attachments: undefined,
            channelData: {
                clientmessageid: message.clientmessageid,
                fromUserId: 'fromUserId',
                tags: undefined
            },
            channelId: IC3_CHANNEL_ID,
            conversation,
            from: { id: message.sender.id, name: message.sender.displayName },
            id: message.clientmessageid,
            messageid: message.messageid,
            suggestedActions: undefined,
            text: message.content,
            timestamp: 'dateString',
            type: ActivityType.Message
        }
        expect(result).toEqual(expectedResult);
    });

    test('should return correct activity with attachments', async () => {
        const message = {
            messageType : 'UserMessage',
            messageid: 'messageid',
            clientmessageid: 'clientmessageid',
            content: 'content',
            properties: { fromUserId: 'fromUserId' },
            sender: { displayName: 'displayName', id: 'senderId' },
            timestamp: new Date(),
            fileMetadata: { type: 'fileType' },
            tags: ['tetTag']
        };
        const conversation = {
            id: 'conversationId',
            downloadFile: () => 'downloadFile'
        }
        const getState = () => conversation;
        const result = await createUserMessageToDirectLineActivityMapper({getState})()(message);
        const expectedResult = {
            attachments: [{
                blob: 'downloadFile',
                contentType: 'application/octet-stream',
                contentUrl: 'objectUrl',
                tempContentUrl: 'objectUrl',
                thumbnailUrl: undefined,
                type: 'fileType'
            }],
            channelData: {
                clientmessageid: message.clientmessageid,
                fromUserId: message.properties.fromUserId,
                tags: message.tags
            },
            channelId: IC3_CHANNEL_ID,
            conversation: { id: conversation.id },
            from: { id: message.sender.id, name: message.sender.displayName },
            id: message.clientmessageid,
            messageid: message.messageid,
            suggestedActions: undefined,
            text: message.content,
            timestamp: 'dateString',
            type: ActivityType.Message,
        }
        expect(result).toEqual(expectedResult);
    });

    test('should return correct activity with image attachment', async () => {
        const message = {
            messageType : 'UserMessage',
            messageid: 'messageid',
            clientmessageid: 'clientmessageid',
            content: 'content',
            properties: { fromUserId: 'fromUserId' },
            sender: { displayName: 'displayName', id: 'senderId' },
            timestamp: new Date(),
            fileMetadata: { type: 'gif' },
            tags: ['client_activity_id:']
        };
        const conversation = {
            id: 'conversationId',
            downloadFile: () => 'downloadFile'
        }
        const getState = () => conversation;
        const result = await createUserMessageToDirectLineActivityMapper({getState})()(message);
        const expectedResult = {
            attachments: [{
                blob: 'downloadFile',
                contentType: 'image/gif',
                contentUrl: 'objectUrl',
                tempContentUrl: 'objectUrl',
                thumbnailUrl: 'objectUrl',
                type: 'gif'
            }],
            channelData: {
                clientActivityID: '',
                clientmessageid: message.clientmessageid,
                fromUserId: message.properties.fromUserId,
                tags: message.tags
            },
            channelId: IC3_CHANNEL_ID,
            conversation: { id: conversation.id },
            from: { id: message.sender.id, name: message.sender.displayName },
            id: message.clientmessageid,
            messageid: message.messageid,
            suggestedActions: undefined,
            text: message.content,
            timestamp: 'dateString',
            type: ActivityType.Message,
        }
        expect(result).toEqual(expectedResult);
    });

    test('should return correct activity with audio attachment', async () => {
        const message = {
            messageType : 'UserMessage',
            messageid: 'messageid',
            clientmessageid: 'clientmessageid',
            content: 'content',
            properties: { fromUserId: 'fromUserId' },
            sender: { displayName: 'displayName', id: 'senderId' },
            timestamp: new Date(),
            fileMetadata: { type: 'mp3' },
            tags: ['client_activity_id:']
        };
        const conversation = {
            id: 'conversationId',
            downloadFile: () => 'downloadFile'
        }
        const getState = (key) => {
            switch(key) {
                case StateKey.FeatureConfig: return {
                    ShouldEnableInlineAudioPlaying: true,
                }
                case StateKey.Conversation: return conversation;
                default: return null
            }
        };
        const result = await createUserMessageToDirectLineActivityMapper({getState})()(message);
        const expectedResult = {
            attachments: [{
                blob: 'downloadFile',
                contentType: 'audio/mp3',
                contentUrl: 'objectUrl',
                tempContentUrl: 'objectUrl',
                thumbnailUrl: 'objectUrl',
                type: 'mp3'
            }],
            channelData: {
                clientActivityID: '',
                clientmessageid: message.clientmessageid,
                fromUserId: message.properties.fromUserId,
                tags: message.tags
            },
            channelId: IC3_CHANNEL_ID,
            conversation: { id: conversation.id },
            from: { id: message.sender.id, name: message.sender.displayName },
            id: message.clientmessageid,
            messageid: message.messageid,
            suggestedActions: undefined,
            text: message.content,
            timestamp: 'dateString',
            type: ActivityType.Message,
        }
        expect(result).toEqual(expectedResult);
    });

    test('should return correct activity with video attachment', async () => {
        const message = {
            messageType : 'UserMessage',
            messageid: 'messageid',
            clientmessageid: 'clientmessageid',
            content: 'content',
            properties: { fromUserId: 'fromUserId' },
            sender: { displayName: 'displayName', id: 'senderId' },
            timestamp: new Date(),
            fileMetadata: { type: 'mp4' },
            tags: ['client_activity_id:']
        };
        const conversation = {
            id: 'conversationId',
            downloadFile: () => 'downloadFile'
        }
        const getState = (key) => {
            switch(key) {
                case StateKey.FeatureConfig: return {
                    ShouldEnableInlineVideoPlaying: true
                }
                case StateKey.Conversation: return conversation;
                default: return null
            }
        };
        const result = await createUserMessageToDirectLineActivityMapper({getState})()(message);
        const expectedResult = {
            attachments: [{
                blob: 'downloadFile',
                contentType: 'video/mp4',
                contentUrl: 'objectUrl',
                tempContentUrl: 'objectUrl',
                thumbnailUrl: 'objectUrl',
                type: 'mp4'
            }],
            channelData: {
                clientActivityID: '',
                clientmessageid: message.clientmessageid,
                fromUserId: message.properties.fromUserId,
                tags: message.tags
            },
            channelId: IC3_CHANNEL_ID,
            conversation: { id: conversation.id },
            from: { id: message.sender.id, name: message.sender.displayName },
            id: message.clientmessageid,
            messageid: message.messageid,
            suggestedActions: undefined,
            text: message.content,
            timestamp: 'dateString',
            type: ActivityType.Message,
        }
        expect(result).toEqual(expectedResult);
    });
});
