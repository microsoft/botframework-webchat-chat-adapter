/// <reference path="../types/ic3/external/Model.d.ts" />
/// <reference path="../types/ic3/external/SDK.d.ts" />

import { IAdapterLogger } from "./telemetry/IAdapterLogger";
import { TelemetryEvents } from "../types/ic3/TelemetryEvents";

const DEFAULT_SDK_URL = 'https://comms.omnichannelengagementhub.com/release/2019.12.27.1/Scripts/SDK/SDK.min.js';

export default function getSDKFromURL(
  url: string | undefined,
  options: Microsoft.CRM.Omnichannel.IC3Client.Model.IClientSDKInitializationParameters
) {
  return new Promise<Microsoft.CRM.Omnichannel.IC3Client.Model.ISDK>((resolve, reject) => {
    const script = document.createElement('script');

    script.setAttribute('async', '');
    script.setAttribute('referrerpolicy', 'no-referrer');
    script.setAttribute('src', url || DEFAULT_SDK_URL);

    script.addEventListener('load', () => resolve(Microsoft.CRM.Omnichannel.IC3Client.SDK.SDKProvider.getSDK(options)));
    script.addEventListener('error', ({ error }) =>
      {
        options?.logger?.logClientSdkTelemetryEvent(Microsoft.CRM.Omnichannel.IC3Client.Model.LogLevel.ERROR,
          {
            Event: TelemetryEvents.IC3_SDK_NOT_FOUND,
            Description: `Adapter: Failed to load IC3 SDK from URL: ${url}`
          }
        );
        reject(error || new Error(`Failed to load IC3 SDK from URL: ${url}`))
      }
    );

    document.head.append(script);
  });
}
