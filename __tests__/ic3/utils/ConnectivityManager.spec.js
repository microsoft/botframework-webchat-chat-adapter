import ConnectivityManager from './../../../src/ic3/utils/ConnectivityManager';

describe('ConnectivityManager tests', () => {
    const testEvent = 'testEvent';
    const testPayload = 'testPayload';
    let fetchBefore;

    beforeAll(() => {
        fetchBefore = global.fetch;
    });

    afterAll(() => {
        global.fetch = fetchBefore
    });
    
    test('constructor should add and remove event listeners', () => {
        spyOn(window, 'addEventListener');
        spyOn(window, 'removeEventListener');
        const instance = new ConnectivityManager();
        expect(window.addEventListener).toHaveBeenCalledWith('online', instance.handleOnline);
        expect(window.addEventListener).toHaveBeenCalledWith('offline', instance.handleOffline);

        instance.end();
        expect(window.removeEventListener).toHaveBeenCalledWith('online', instance.handleOnline);
        expect(window.removeEventListener).toHaveBeenCalledWith('offline', instance.handleOffline);
    });

    test('isInternetConnected should return false', async () => {
        global.fetch = jest.fn(() =>
            Promise.resolve({
                ok: true,
                text: () => 'text'
            })
        );
        const result = await ConnectivityManager.isInternetConnected();
        expect(result).toBe(false);
    });

    test('isInternetConnected should return false', async () => {
        global.fetch = jest.fn(() =>
            Promise.resolve({
                ok: false,
                text: () => 'text'
            })
        );
        const result = await ConnectivityManager.isInternetConnected();
        expect(result).toBe(false);
    });

    test('isInternetConnected should return true', async () => {
        const connectionTestUrlText = "Omnichannel Connect Test";
        global.fetch = jest.fn(() =>
            Promise.resolve({
                ok: true,
                text: () => connectionTestUrlText
            })
        );
        const result = await ConnectivityManager.isInternetConnected();
        expect(result).toBe(true);
    });

    test('handleOnline should not raise custom event when internet is not connected', async () => {
        const instance = new ConnectivityManager();
        spyOn(ConnectivityManager, 'isInternetConnected').and.returnValue(false);
        spyOn(instance, 'raiseCustomEvent');
        await instance.handleOnline();
        expect(instance.raiseCustomEvent).not.toHaveBeenCalled();
    });

    test('handleOnline should raise custom event when internet is connected', async () => {
        const instance = new ConnectivityManager();
        spyOn(ConnectivityManager, 'isInternetConnected').and.returnValue(true);
        spyOn(instance, 'raiseCustomEvent');
        await instance.handleOnline();
        expect(instance.raiseCustomEvent).toHaveBeenCalledWith('online');
    });

    test('handleOffline should raise custom event when internet is not connected', async () => {
        const instance = new ConnectivityManager();
        spyOn(ConnectivityManager, 'isInternetConnected').and.returnValue(false);
        spyOn(instance, 'raiseCustomEvent');
        await instance.handleOffline();
        expect(instance.raiseCustomEvent).toHaveBeenCalledWith('offline');
    });

    test('handleOffline should not raise custom event when internet is connected', async () => {
        const instance = new ConnectivityManager();
        spyOn(ConnectivityManager, 'isInternetConnected').and.returnValue(true);
        spyOn(instance, 'raiseCustomEvent');
        await instance.handleOffline();
        expect(instance.raiseCustomEvent).not.toHaveBeenCalled();
    });

    test('raiseCustomEvent should dispatch new Custom event with correct params', () => {
        const instance = new ConnectivityManager();
        spyOn(instance, 'dispatchEvent');
        instance.raiseCustomEvent(testEvent, testPayload);
        expect(instance.dispatchEvent).toHaveBeenCalledWith(new CustomEvent(testEvent));
    });
});