import { getTelemetryEventData } from "./TelemetryUtil";

function log(loglevel: Microsoft.CRM.Omnichannel.IC3Client.Model.LogLevel,
	telemetryEvent: string,
	customData?: Microsoft.CRM.Omnichannel.IC3Client.Model.IIC3TelemetryCustomData): void { // tslint:disable-line max-line-length no-any
	if (this.isLoggingEnabled()) {
		const logData = getTelemetryEventData(telemetryEvent, customData);
		logEvent(loglevel, logData);
	}
}

function logEvent(logLevel: Microsoft.CRM.Omnichannel.IC3Client.Model.LogLevel, logData: Microsoft.CRM.Omnichannel.IC3Client.Model.IIC3SDKLogData) {
	setTimeout(this.logger.logClientSdkTelemetryEvent.bind(this.logger), 0, logLevel, logData);
}

export function info(telemetryEvent: string,
	customData?: Microsoft.CRM.Omnichannel.IC3Client.Model.IIC3TelemetryCustomData) {
	log(Microsoft.CRM.Omnichannel.IC3Client.Model.LogLevel.INFO, telemetryEvent, customData);
}

export function debug(telemetryEvent: string,
	customData?: Microsoft.CRM.Omnichannel.IC3Client.Model.IIC3TelemetryCustomData) {
	log(Microsoft.CRM.Omnichannel.IC3Client.Model.LogLevel.DEBUG, telemetryEvent, customData);
}

export function warn(telemetryEvent: string,
	customData?: Microsoft.CRM.Omnichannel.IC3Client.Model.IIC3TelemetryCustomData) {
	log(Microsoft.CRM.Omnichannel.IC3Client.Model.LogLevel.WARN, telemetryEvent, customData);
}

export function error(telemetryEvent: string,
	customData?: Microsoft.CRM.Omnichannel.IC3Client.Model.IIC3TelemetryCustomData) {
	log(Microsoft.CRM.Omnichannel.IC3Client.Model.LogLevel.ERROR, telemetryEvent, customData);
}