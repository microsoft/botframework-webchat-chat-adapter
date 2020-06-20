import getSDKFromURL from './getSDKFromURL';
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
    _sdk = sdk;
  } catch(error){
    console.error("IC3 SDK init failed.", error);
    _sdk = null;
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