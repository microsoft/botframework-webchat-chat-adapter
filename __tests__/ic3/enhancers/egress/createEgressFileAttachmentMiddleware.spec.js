import createEgressMessageActivityMiddleware from './../../../../src/ic3/enhancers/egress/createEgressFileAttachmentMiddleware';
import { StateKey } from './../../../../src/types/ic3/IC3AdapterState';
import { TelemetryEvents } from './../../../../src/types/ic3/TelemetryEvents';
import { ActivityType } from './../../../../src/types/DirectLineTypes';

describe('createEgressFileAttachmentMiddleware test', () => {
    let globalMicrosoftBefore;
    let fetchBefore;

    beforeAll(() => {
        spyOn(Date.prototype, 'toISOString').and.returnValue('dateString');
        globalMicrosoftBefore = global.Microsoft;
        fetchBefore = global.fetch;
        global.Microsoft = {
            CRM: {
                Omnichannel: {
                    IC3Client: {
                        Model: {
                            LogLevel: { ERROR: 'ERROR' }
                        }
                    }
                },
            }
        }
    });

    afterAll(() => {
        global.Microsoft = globalMicrosoftBefore;
        global.fetch = fetchBefore;
    });

    test('should return next', async () => {
        const activity = { type: ActivityType.Message }
        const next = 'next'
        const result = await createEgressMessageActivityMiddleware()({getState: () => {}})(() => next)(activity)
        expect(result).toBe(next);
    });

    test('should throw error', async () => {
        const mockLogClientSdkTelemetryEvent = jest.fn();
        const activity = {
            type: ActivityType.Message,
            attachments: [{}]
        }
        const getState = (key) => key === StateKey.Logger ? { logClientSdkTelemetryEvent: mockLogClientSdkTelemetryEvent } : null;
        try {
            await createEgressMessageActivityMiddleware()({getState})()(activity);
        } catch(e) {
            expect(e).toEqual(new Error('IC3: Failed to egress without an active conversation.'));
            expect(mockLogClientSdkTelemetryEvent).toHaveBeenCalledWith('ERROR', {
                Event: TelemetryEvents.CONVERSATION_NOT_FOUND,
                Description: `Adapter: Failed to egress without an active conversation.`
            });
        }
    });

    test('should call next with correct individualActivity', async () => {
        global.fetch = () => ({
            ok: true,
            blob: () => 'resBlob'
        });
        const next = jest.fn();
        const activity = {
            type: ActivityType.Message,
            attachments: [
                { contentUrl: 'contentUrl1', name: 'attachmentName1', contentType: 'type1' },
                { contentUrl: 'contentUrl2', name: 'attachmentName2', contentType: 'type2' }
            ]
        }
        const conversation = { uploadFile: () => 'file uploaded' }
        const getState = () => conversation;
        await createEgressMessageActivityMiddleware()({ getState })(next)(activity);
        const expectedIndividualActivity = {
            attachments: [
                {
                    blob: 'resBlob',
                    contentType: activity.attachments[0].contentType,
                    contentUrl: activity.attachments[0].contentUrl,
                    name: activity.attachments[0].name
                },
                {
                    blob: 'resBlob',
                    contentType: activity.attachments[1].contentType,
                    contentUrl: activity.attachments[1].contentUrl,
                    name: activity.attachments[1].name
                }
            ],
            channelData: {
                middlewareData: {
                    [activity.attachments[0].name]: activity.attachments[0].contentUrl,
                    [activity.attachments[1].name]: activity.attachments[1].contentUrl
                },
                uploadedFileMetadata: 'file uploaded'
            },
            timestamp: 'dateString',
            type: ActivityType.Message
        };
        expect(next).toHaveBeenCalledWith(expectedIndividualActivity)
    });
    
    test('should throw error on failed attachment fetch', async () => {
        const mockLogClientSdkTelemetryEvent = jest.fn();
        global.fetch = () => ({ ok: false });
        const activity = {
            type: ActivityType.Message,
            attachments: [{ contentUrl: 'contentUrl1', name: 'attachmentName1', contentType: 'type1' }]
        }
        const getState = () => ({logClientSdkTelemetryEvent: mockLogClientSdkTelemetryEvent});

        try {
            await createEgressMessageActivityMiddleware()({ getState })(() => {})(activity);
        } catch(e) {            
            expect(e).toEqual(new Error('IC3: Failed to fetch attachment to send.'));
            expect(mockLogClientSdkTelemetryEvent).toHaveBeenCalledWith('ERROR', {
                Event: TelemetryEvents.FETCH_ATTACHMENT_FAILED,
                Description: `Adapter: Failed to fetch attachment to send.`
            });
        }
    });
});
