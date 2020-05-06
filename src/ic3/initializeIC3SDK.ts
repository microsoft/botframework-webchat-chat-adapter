import getSDKFromURL from './getSDKFromURL';

export default async function initializeIC3SDK(
  sdkURL: string | undefined,
  options: Microsoft.CRM.Omnichannel.IC3Client.Model.IClientSDKInitializationParameters,
  sessionInfo: Microsoft.CRM.Omnichannel.IC3Client.Model.IInitializationInfo
): Promise<Microsoft.CRM.Omnichannel.IC3Client.Model.ISDK> {
  // TODO: The original code will always re-initialize on every call to this function.
  //       Looks like it does not make sense to cache the result because it always initialize.

  const sdk = await getSDKFromURL(sdkURL, options);
  console.log("session info: ", sdkURL, options, sessionInfo);
  await sdk.initialize(sessionInfo);

  return sdk;
}
