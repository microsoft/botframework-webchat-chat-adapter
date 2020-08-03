import { getTelemetryEventData } from "./TelemetryUtil";

export default function createLogger(logger: any) {
	const logEvent = (logLevel: Microsoft.CRM.Omnichannel.IC3Client.Model.LogLevel, logData: Microsoft.CRM.Omnichannel.IC3Client.Model.IIC3SDKLogData) => {
		setTimeout(logger.logClientSdkTelemetryEvent.bind(logger), 0, logLevel, logData);
	}

	return {
		log(loglevel: Microsoft.CRM.Omnichannel.IC3Client.Model.LogLevel,
			telemetryEvent: string,
			customData?: Microsoft.CRM.Omnichannel.IC3Client.Model.IIC3TelemetryCustomData): void { // tslint:disable-line max-line-length no-any

			const logData = getTelemetryEventData(telemetryEvent, customData);
			
			logEvent(loglevel, logData);
		}
	}
}