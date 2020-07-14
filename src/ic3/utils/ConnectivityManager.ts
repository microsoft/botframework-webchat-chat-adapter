import EventTarget, {defineEventAttribute} from 'event-target-shim-es5';

type ConnectivityManagerEvents = {
    online: CustomEvent,
    offline: CustomEvent
}
type ConnectivityManagerEventAttributes = {
    ononline: CustomEvent,
    onoffline: CustomEvent
}

export default class ConnectivityManager extends EventTarget {

    /**
     *  Check if connected to the internet
     *  Reference: https://support.microsoft.com/en-us/help/4494446/an-internet-explorer-or-edge-window-opens-when-your-computer-connects
     */
    public static async isInternetConnected() {
        const connectionTestUrl = "https://ocsdk-prod.azureedge.net/public/connecttest.txt";
        const connectionTestUrlText = "Omnichannel Connect Test";
        try {
            const response = await fetch(connectionTestUrl, {cache: "no-cache"});
            const { ok } = response;
            if (ok) {
                const text = await response.text();
                if (text === connectionTestUrlText) {
                    return true;
                }
            }
        } catch {

        }
        return false;
    }

    //this function is not ready to use yet
    private raiseCustomEvent(eventName: string, payload?: any) { // tslint:disable-line:no-any
        const eventDetails = payload ? {
            detail: payload
        } : undefined;

        let event = null;
        try {
            // For non IE11 scenarios, customevent object can be dispatched
            event = new CustomEvent(eventName);
        } catch (e) {
            // Special handling for IE11 scenario, where customevent object cannot be dispatched
            event = document.createEvent("CustomEvent");
            event.initCustomEvent(eventName, true, true, eventDetails); // tslint:disable-line:no-any
        }

        this.dispatchEvent(event);
    }

    constructor() {
        super();

        this.handleOnline = this.handleOnline.bind(this);
        this.handleOffline = this.handleOffline.bind(this);

        // Checking connection status on online & offline events due to possible false positives
        window.addEventListener('online', this.handleOnline);
        window.addEventListener('offline', this.handleOffline);
    }

    end() {
        window.removeEventListener('online', this.handleOnline);
        window.removeEventListener('offline', this.handleOffline)
    }

    async handleOnline() {
        if (await ConnectivityManager.isInternetConnected()) {
            this.raiseCustomEvent('online');
        }
    }

    async handleOffline() {
        if (!await ConnectivityManager.isInternetConnected()) {
            this.raiseCustomEvent('offline');
        }
    }
}

defineEventAttribute(ConnectivityManager.prototype, 'online');
defineEventAttribute(ConnectivityManager.prototype, 'offline');