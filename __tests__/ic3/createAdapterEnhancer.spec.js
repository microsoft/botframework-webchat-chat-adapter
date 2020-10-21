import createIC3Enhancer from './../../src/ic3/createAdapterEnhancer';
import { StateKey } from './../../src/types/ic3/IC3AdapterState';
import * as initializeIC3SDK from './../../src/ic3/initializeIC3SDK';
import * as getPlatformBotId from './../../src/ic3/utils/getPlatformBotId';

jest.mock('redux', () => ({
    compose: (param1, param2, param3) => param1
}));

describe('createAdapterEnhancer tests', () => {
    let globalMicrosoftBefore;
    const mockAdapter = {
        setState: () => {},
        setReadyState: () => {}
    }
    const conversation = { joinConversation: () => 'conversation'}
    const logger = { logClientSdkTelemetryEvent: () => { } }
    const next = () => mockAdapter;
    const botId = 'BotId';
    const userDisplayName = 'Test Name';
    const userId = 'Test User Id';
    const featureConfig = 'test config';
    beforeAll(() => {
        globalMicrosoftBefore = global.Microsoft;
        global.Microsoft = {
            CRM: {
                Omnichannel: {
                    IC3Client: {
                        Model: {
                            LogLevel: {
                                DEBUG: 'DEBUG'
                            }
                        }
                    }
                },
            }
        }
        initializeIC3SDK.default = () => ({ joinConversation: () => ({}) });
        getPlatformBotId.default = () => botId;
        
        spyOn(mockAdapter, 'setState');
        spyOn(mockAdapter, 'setReadyState');
    });
    afterAll(() => {
        global.Microsoft = globalMicrosoftBefore;
    })

    test('should return correct result without conversation', () => {
        const ic3AdapterOptions = {
            chatToken: { regionGTMS: 'region', token: 'token' },
            hostType: 0,
            logger,
            protocolType: 0,
            sdkUrl: 'test url',
            sdkURL: undefined,
            userDisplayName,
            userId,
            featureConfig
        }
        spyOn(initializeIC3SDK, 'default').and.returnValue(conversation);
        const enhancer = createIC3Enhancer(ic3AdapterOptions);
        const result = enhancer(next)();
        expect(mockAdapter.setState).toHaveBeenCalledWith(StateKey.BotId, undefined);
        expect(mockAdapter.setState).toHaveBeenCalledWith(StateKey.Conversation, undefined);
        expect(mockAdapter.setState).toHaveBeenCalledWith(StateKey.UserDisplayName, undefined);
        expect(mockAdapter.setState).toHaveBeenCalledWith(StateKey.UserId, undefined);
        expect(mockAdapter.setState).toHaveBeenCalledWith(StateKey.FeatureConfig, undefined);
        expect(mockAdapter.setState).toHaveBeenCalledWith(StateKey.Logger, undefined);
        expect(mockAdapter.setState).toHaveBeenCalledWith(StateKey.ConnectionStatusObserverReady, false);
        expect(initializeIC3SDK.default).toHaveBeenCalledWith(
            ic3AdapterOptions.sdkUrl,
            {
                hostType: ic3AdapterOptions.hostType,
                protocolType: ic3AdapterOptions.protocolType,
                logger
            },
            {
                regionGtms: ic3AdapterOptions.chatToken.regionGTMS,
                token: ic3AdapterOptions.chatToken.token,
                visitor: true
            }
        );
        expect(result).toEqual(mockAdapter);
    });

    test('should return correct result with provided conversation', () => {
        spyOn(initializeIC3SDK, 'default');
        const ic3AdapterOptions = {
            chatToken: { regionGTMS: 'region', token: 'token' },
            hostType: undefined,
            logger,
            protocolType: undefined,
            sdkUrl: 'test url',
            sdkURL: 'TEST URL',
            userDisplayName,
            userId,
            featureConfig,
            conversation
        }
        const enhancer = createIC3Enhancer(ic3AdapterOptions);
        const result = enhancer(next)();
        expect(mockAdapter.setState).toHaveBeenCalledWith(StateKey.BotId, undefined);
        expect(mockAdapter.setState).toHaveBeenCalledWith(StateKey.Conversation, undefined);
        expect(mockAdapter.setState).toHaveBeenCalledWith(StateKey.UserDisplayName, undefined);
        expect(mockAdapter.setState).toHaveBeenCalledWith(StateKey.UserId, undefined);
        expect(mockAdapter.setState).toHaveBeenCalledWith(StateKey.FeatureConfig, undefined);
        expect(mockAdapter.setState).toHaveBeenCalledWith(StateKey.Logger, undefined);
        expect(mockAdapter.setState).toHaveBeenCalledWith(StateKey.ConnectionStatusObserverReady, false);
        expect(initializeIC3SDK.default).not.toHaveBeenCalled();
        expect(result).toEqual(mockAdapter);
    })
});
