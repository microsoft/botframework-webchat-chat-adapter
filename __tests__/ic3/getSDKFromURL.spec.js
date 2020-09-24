import getSDKFromURL from './../../src/ic3/getSDKFromURL';

describe('getSDKFromURL tests', () => {
    let globalMicrosoftBefore;
    const mockSdk = 'sdk';
    const url = 'testurl';
    const logger = { logClientSdkTelemetryEvent: () => {} }
    const mockEl = {
        setAttribute: () => {}
    }

    beforeAll(() => {
        globalMicrosoftBefore = global.Microsoft;
        global.Microsoft = {
            CRM: {
                Omnichannel: {
                    IC3Client: {
                        Model: {
                            LogLevel: {
                                ERROR: 'ERROR'
                            }
                        },
                        SDK: {
                            SDKProvider: {
                                getSDK: () => mockSdk
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

    test('should set correct attributes and add event listneres', () => {
        const DEFAULT_SDK_URL = 'https://comms.omnichannelengagementhub.com/release/2019.12.27.1/Scripts/SDK/SDK.min.js';
        mockEl.addEventListener = () => { }
        spyOn(mockEl, 'setAttribute');
        spyOn(mockEl, 'addEventListener');
        const spyFunc = jest.fn(() => mockEl);
        Object.defineProperty(global.document, 'createElement', { value: spyFunc, writable: true });
        getSDKFromURL(undefined, { logger })
        expect(spyFunc).toHaveBeenCalledWith('script');
        expect(mockEl.setAttribute).toHaveBeenCalledWith('async', '');
        expect(mockEl.setAttribute).toHaveBeenCalledWith('referrerpolicy', 'no-referrer');
        expect(mockEl.setAttribute).toHaveBeenCalledWith('src', DEFAULT_SDK_URL);
        expect(mockEl.addEventListener).toHaveBeenCalledWith('load', expect.any(Function));
        expect(mockEl.addEventListener).toHaveBeenCalledWith('error', expect.any(Function));
    });

    test('test load event listener', async () => {
        mockEl.addEventListener = (param1, param2) => {
            if (param1 === 'load') {
                param2()
            }
        }
        const spyFunc = jest.fn(() => mockEl);
        Object.defineProperty(global.document, 'createElement', { value: spyFunc, writable: true });
        const result = await getSDKFromURL(url, { logger });
        expect(result).toEqual(mockSdk);
    });

    test('test error event listener', async () => {
        mockEl.addEventListener = (param1, param2) => {
            if (param1 === 'error') {
                param2({})
            }
        }
        const spyFunc = jest.fn(() => mockEl);
        Object.defineProperty(global.document, 'createElement', { value: spyFunc, writable: true });
        try {
            await getSDKFromURL(url, { logger })
        } catch (e) {
            expect(e).toEqual(new Error(`Failed to load IC3 SDK from URL: ${url}`))
        }
    });
});