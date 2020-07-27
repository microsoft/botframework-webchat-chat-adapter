export function getTelemetryEventData(telemetryEvent: string,
  customData?: Microsoft.CRM.Omnichannel.IC3Client.Model.IIC3TelemetryCustomData): Microsoft.CRM.Omnichannel.IC3Client.Model.IIC3SDKLogData { // tslint:disable-line max-line-length no-any
  const logData: Microsoft.CRM.Omnichannel.IC3Client.Model.IIC3SDKLogData = {
      Description: customData.Description,
      ElapsedTimeInMilliseconds: customData.ElapsedTimeInMilliseconds,
      ErrorCode: customData.ErrorCode,
      Event: telemetryEvent,
      ExceptionDetails: customData.ExceptionDetails,
      ShouldBubbleToHost: customData.ShouldBubbleToHost
  };
  return logData;
}