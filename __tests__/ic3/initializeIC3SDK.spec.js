import initializeIC3SDK, { getSdk, getParams } from './../../src/ic3/initializeIC3SDK';
import * as getSDKFromURL from './../../src/ic3/getSDKFromURL';

describe('initializeIC3SDK tests', () => {
    let globalMicrosoftBefore;
    const sdkURL = 'sdkURL';
    const options = {
        logger: {
            logClientSdkTelemetryEvent: () => {}
        }
    }
    const mockSDK = {
        initialize: () => {}
    }
    getSDKFromURL.default = () => mockSDK;

    beforeAll(() => {
        globalMicrosoftBefore = global.Microsoft;
        global.Microsoft = {
            CRM: {
                Omnichannel: {
                    IC3Client: {
                        Model: {
                            LogLevel: {
                                DEBUG: 'DEBUG',
                                ERROR: 'ERROR'
                            }
                        }
                    }
                },
            }
        }
    });

    afterAll(() => {
        global.Microsoft = globalMicrosoftBefore;
    });

    test('should return correct sdk', async () => {
        const sessionInfo = { token: 'token' }
        const result = await initializeIC3SDK(sdkURL, options, sessionInfo);
        const expectedParams = {
            sdkUrl: sdkURL,
            options,
            sessionInfo
        }
        expect(result).toEqual(mockSDK);
        expect(getSdk()).toEqual(result);
        expect(getParams()).toEqual(expectedParams)
    });

    test('should throw error', async () => {
        try {
            await initializeIC3SDK(sdkURL, options, {});
        } catch (e) {
            expect(e).toEqual(new Error('chatToken must be specified.'));
        }
    });
});
