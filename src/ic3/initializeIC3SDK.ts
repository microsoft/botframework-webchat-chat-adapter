import getSDKFromURL from './getSDKFromURL';
import { debug } from './telemetry/logger';
import { TELEMETRY_EVENT_IC3_SDK_INITIALIZE_SUCCESS, TELEMETRY_EVENT_IC3_SDK_INITIALIZE_FAILURE } from './telemetry/telemetryEvents';
let _sdk: Microsoft.CRM.Omnichannel.IC3Client.Model.ISDK | null = null;
let _sdkInfo: any;
export default async function initializeIC3SDK(
  sdkURL: string | undefined,
  options: Microsoft.CRM.Omnichannel.IC3Client.Model.IClientSDKInitializationParameters,
  sessionInfo: Microsoft.CRM.Omnichannel.IC3Client.Model.IInitializationInfo
): Promise<Microsoft.CRM.Omnichannel.IC3Client.Model.ISDK> {
  // TODO: The original code will always re-initialize on every call to this function.
  //       Looks like it does not make sense to cache the result because it always initialize.
  _sdkInfo = {
    sdkUrl: sdkURL,
    options: options,
    sessionInfo: sessionInfo
  };
  try{
    const sdk = await getSDKFromURL(sdkURL, options);
    await sdk.initialize(sessionInfo);
    debug(TELEMETRY_EVENT_IC3_SDK_INITIALIZE_SUCCESS, {
      Description: `Adapter: IC3 SDK initialization success`
    });
    _sdk = sdk;
  } catch(error){
    _sdk = null;
    error(TELEMETRY_EVENT_IC3_SDK_INITIALIZE_FAILURE, {
      Description: `Adapter: IC3 SDK initialization failure`
    });
    throw error;
  }

  return _sdk;
}
export function getSdk(): Microsoft.CRM.Omnichannel.IC3Client.Model.ISDK | null {
  return _sdk;
}

export function getParams(): any {
  return _sdkInfo;
}