export interface IAdapterLogger {
    info: (telemetryEvent: string,
        customData?: Microsoft.CRM.Omnichannel.IC3Client.Model.IIC3TelemetryCustomData) => void;
    error: (telemetryEvent: string,
        customData?: Microsoft.CRM.Omnichannel.IC3Client.Model.IIC3TelemetryCustomData) => void;
    warn: (telemetryEvent: string,
        customData?: Microsoft.CRM.Omnichannel.IC3Client.Model.IIC3TelemetryCustomData) => void;
    debug: (telemetryEvent: string,
        customData?: Microsoft.CRM.Omnichannel.IC3Client.Model.IIC3TelemetryCustomData) => void;
}