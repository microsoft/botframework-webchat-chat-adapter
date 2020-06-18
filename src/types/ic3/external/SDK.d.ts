declare namespace Microsoft.CRM.Omnichannel.IC3Client.SDK {
  class SDKProvider {
    static getSDK(initializationParams: Model.IClientSDKInitializationParameters): Promise<Model.ISDK>;
  }
}

declare namespace Microsoft.CRM.Omnichannel.IC3Client.SDK {
  class Bootstrapper {
    bootstrap(): void;
    private getSDKUrl;
    private shouldLoadJQuery;
    private onLoadJQuery;
    private shouldLoadBluebird;
    private onBootstrapComplete;
  }
}
