import createExtractAdaptiveCardMiddleware from './../../../../src/ic3/enhancers/ingress/createExtractAdaptiveCardMiddleware';
import { ActivityType } from './../../../../src/types/DirectLineTypes';
import { TelemetryEvents } from './../../../../src/types/ic3/TelemetryEvents';

describe('createExtractAdaptiveCardMiddleware test', () => {
    let globalMicrosoftBefore;
    let globalDecodeURIComponentBefore;
    const mockLogClientSdkTelemetryEvent = jest.fn();
    const next = 'next';

    beforeAll(() => {
        globalMicrosoftBefore = global.Microsoft;
        globalDecodeURIComponentBefore = global.decodeURIComponent;
        global.Microsoft = {
            CRM: {
                Omnichannel: {
                    IC3Client: {
                        Model: {
                            LogLevel: { WARN: 'WARN' }
                        }
                    }
                },
            }
        }
    });

    afterAll(() => {
        global.Microsoft = globalMicrosoftBefore;
        global.decodeURIComponent = globalDecodeURIComponentBefore
    });

    test('should return next when activity type is not message', () => {
        const result = createExtractAdaptiveCardMiddleware()({getState: () => {}})(() => next)({});
        expect(result).toBe(next);
    });

    test('should return next on wrong activity text', () => {
        const activity = { text: 'testText', type: ActivityType.Message }
        const result = createExtractAdaptiveCardMiddleware()({getState: () => {}})(() => next)(activity);
        expect(result).toBe(next);
    });

    test('should return next on TAG_PARSE_ERROR', () => {
        const mockDomParser = {
            getElementsByTagName: () => [{}]
        }
        spyOn(DOMParser.prototype, 'parseFromString').and.returnValue(mockDomParser);
        const activity = { text: 'URIObject', type: ActivityType.Message }
        const getState = () => ({logClientSdkTelemetryEvent: mockLogClientSdkTelemetryEvent})
        const result = createExtractAdaptiveCardMiddleware()({ getState })(() => next)(activity);
        expect(result).toBe(next);
        expect(mockLogClientSdkTelemetryEvent).toHaveBeenCalledWith('WARN', {
            Event: TelemetryEvents.ADAPTIVE_CARD_PROCESSING_ERROR,
            Description: `Adapter: [AdaptiveCard] Unable to parse XML; ignoring attachment.`
        });
    });

    test('should return next when element nodeName is not CONTENT_URI_OBJECT', () => {
        const mockDomParser = {
            getElementsByTagName: () => [],
            documentElement: { nodeName: 'testNodeName' }
        }
        spyOn(DOMParser.prototype, 'parseFromString').and.returnValue(mockDomParser);
        const activity = { text: 'URIObject', type: ActivityType.Message }
        const getState = () => ({logClientSdkTelemetryEvent: mockLogClientSdkTelemetryEvent})
        const result = createExtractAdaptiveCardMiddleware()({ getState })(() => next)(activity);
        expect(result).toBe(next);
        expect(mockLogClientSdkTelemetryEvent).toHaveBeenCalledWith('WARN', {
            Event: TelemetryEvents.ADAPTIVE_CARD_PROCESSING_ERROR,
            Description: `Adapter: [AdaptiveCard] Wrong XML schema; ignoring attachment.`
        });
    });

    test('should return next when no Swift element', () => {
        const mockDomParser = {
            getElementsByTagName: () => [],
            documentElement: { nodeName: 'URIObject' }
        }
        spyOn(DOMParser.prototype, 'parseFromString').and.returnValue(mockDomParser);
        const activity = { text: 'URIObject', type: ActivityType.Message }
        const getState = () => ({logClientSdkTelemetryEvent: mockLogClientSdkTelemetryEvent})
        const result = createExtractAdaptiveCardMiddleware()({ getState })(() => next)(activity);
        expect(result).toBe(next);
        expect(mockLogClientSdkTelemetryEvent).toHaveBeenCalledWith('WARN', {
            Event: TelemetryEvents.ADAPTIVE_CARD_PROCESSING_ERROR,
            Description: `Adapter: [AdaptiveCard] Does not contain <Swift>; ignoring attachment.`
        });
    });

    test('should return next when no swiftJSON', () => {
        const mockdecodeURIComponent = jest.fn().mockReturnValue('');
        global.decodeURIComponent = mockdecodeURIComponent;
        const swiftElement = { getAttribute: () => '' }
        const mockDomParser = {
            getElementsByTagName: (tag) => tag === 'Swift' ? [swiftElement] : [],
            documentElement: { nodeName: 'URIObject' }
        }
        spyOn(DOMParser.prototype, 'parseFromString').and.returnValue(mockDomParser);
        const activity = { text: 'URIObject', type: ActivityType.Message }
        const getState = () => ({logClientSdkTelemetryEvent: mockLogClientSdkTelemetryEvent})
        const result = createExtractAdaptiveCardMiddleware()({ getState })(() => next)(activity);
        expect(result).toBe(next);
        expect(mockLogClientSdkTelemetryEvent).toHaveBeenCalledWith('WARN', {
            Event: TelemetryEvents.ADAPTIVE_CARD_PROCESSING_ERROR,
            Description: `Adapter: [AdaptiveCard] Data is empty; ignoring attachment.`
        });
    });

    test('should return next when swift type does not include TYPE_MESSAGE_CARD', () => {
        const mockSwift = { type: 'message' }
        const mockdecodeURIComponent = jest.fn().mockReturnValue(JSON.stringify(mockSwift));
        global.decodeURIComponent = mockdecodeURIComponent;
        const swiftElement = { getAttribute: () => '' }
        const mockDomParser = {
            getElementsByTagName: (tag) => tag === 'Swift' ? [swiftElement] : [],
            documentElement: { nodeName: 'URIObject' }
        }
        spyOn(DOMParser.prototype, 'parseFromString').and.returnValue(mockDomParser);
        const activity = { text: 'URIObject', type: ActivityType.Message }
        const getState = () => ({logClientSdkTelemetryEvent: mockLogClientSdkTelemetryEvent})
        const result = createExtractAdaptiveCardMiddleware()({ getState })(() => next)(activity);
        expect(result).toBe(next);
    });

    test('should return next when no swift attachments', () => {
        const mockSwift = { type: 'message/card' }
        const mockdecodeURIComponent = jest.fn().mockReturnValue(JSON.stringify(mockSwift));
        global.decodeURIComponent = mockdecodeURIComponent;
        const swiftElement = { getAttribute: () => '' }
        const mockDomParser = {
            getElementsByTagName: (tag) => tag === 'Swift' ? [swiftElement] : [],
            documentElement: { nodeName: 'URIObject' }
        }
        spyOn(DOMParser.prototype, 'parseFromString').and.returnValue(mockDomParser);
        const activity = { text: 'URIObject', type: ActivityType.Message }
        const getState = () => ({logClientSdkTelemetryEvent: mockLogClientSdkTelemetryEvent})
        const result = createExtractAdaptiveCardMiddleware()({ getState })(() => next)(activity);
        expect(result).toBe(next);
        expect(mockLogClientSdkTelemetryEvent).toHaveBeenCalledWith('WARN', {
            Event: TelemetryEvents.ADAPTIVE_CARD_PROCESSING_ERROR,
            Description: `Adapter: [AdaptiveCard] Key 'attachments' not found; ignoring attachment.`
        });
    });

    test('should call next whith correct params', () => {
        const mockSwift = { type: 'message/card', attachments: [] }
        const mockdecodeURIComponent = jest.fn().mockReturnValue(JSON.stringify(mockSwift));
        global.decodeURIComponent = mockdecodeURIComponent;
        const swiftElement = { getAttribute: () => '' }
        const mockDomParser = {
            getElementsByTagName: (tag) => tag === 'Swift' ? [swiftElement] : [],
            documentElement: { nodeName: 'URIObject' }
        }
        spyOn(DOMParser.prototype, 'parseFromString').and.returnValue(mockDomParser);
        const activity = { text: 'URIObject', type: ActivityType.Message }
        const getState = () => ({logClientSdkTelemetryEvent: mockLogClientSdkTelemetryEvent})
        const result = createExtractAdaptiveCardMiddleware()({ getState })((param) => param)(activity);
        const expectedResult = { attachments: mockSwift.attachments, text: '', type: 'message' };
        expect(result).toEqual(expectedResult);
    });
});
