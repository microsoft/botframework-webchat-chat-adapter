import { getTelemetryEventData } from "./TelemetryUtil";
import { IAdapterLogger } from "./IAdapterLogger";

export default function createLogger(logger: any): IAdapterLogger {
	const logEvent = (logLevel: Microsoft.CRM.Omnichannel.IC3Client.Model.LogLevel, logData: Microsoft.CRM.Omnichannel.IC3Client.Model.IIC3SDKLogData) => {
		setTimeout(logger.logClientSdkTelemetryEvent.bind(logger), 0, logLevel, logData);
	}

	const log = (loglevel: Microsoft.CRM.Omnichannel.IC3Client.Model.LogLevel,
		telemetryEvent: string,
		customData?: Microsoft.CRM.Omnichannel.IC3Client.Model.IIC3TelemetryCustomData) => {
		const logData = getTelemetryEventData(telemetryEvent, customData);
		
		logEvent(loglevel, logData);
	}

	return {
		info(telemetryEvent: string,
			customData?: Microsoft.CRM.Omnichannel.IC3Client.Model.IIC3TelemetryCustomData) {
			log(Microsoft.CRM.Omnichannel.IC3Client.Model.LogLevel.INFO, telemetryEvent, customData);
		},
		
		debug(telemetryEvent: string,
			customData?: Microsoft.CRM.Omnichannel.IC3Client.Model.IIC3TelemetryCustomData) {
			log(Microsoft.CRM.Omnichannel.IC3Client.Model.LogLevel.DEBUG, telemetryEvent, customData);
		},
		
		warn(telemetryEvent: string,
			customData?: Microsoft.CRM.Omnichannel.IC3Client.Model.IIC3TelemetryCustomData) {
			log(Microsoft.CRM.Omnichannel.IC3Client.Model.LogLevel.WARN, telemetryEvent, customData);
		},
		
		error(telemetryEvent: string,
			customData?: Microsoft.CRM.Omnichannel.IC3Client.Model.IIC3TelemetryCustomData) {
			log(Microsoft.CRM.Omnichannel.IC3Client.Model.LogLevel.ERROR, telemetryEvent, customData);
		}
	}
}