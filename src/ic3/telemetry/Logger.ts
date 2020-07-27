import { getTelemetryEventData } from "./TelemetryUtil";

export class Logger {
	private logger: Microsoft.CRM.Omnichannel.IC3Client.Model.ILogger;
	private static _instance: Logger;

	public static getInstance() {
		if (this._instance) {
			return this._instance;
		} else {
			return new Logger();
		}
	}

	public setLogger(logger: Microsoft.CRM.Omnichannel.IC3Client.Model.ILogger) {
		this.logger = logger;
	}

	private log(loglevel: Microsoft.CRM.Omnichannel.IC3Client.Model.LogLevel,
		telemetryEvent: string,
		customData?: Microsoft.CRM.Omnichannel.IC3Client.Model.IIC3TelemetryCustomData): void { // tslint:disable-line max-line-length no-any
		if (this.isLoggingEnabled()) {
			const logData = getTelemetryEventData(telemetryEvent, customData);
			this.logEvent(loglevel, logData);
		}
	}

	public info(telemetryEvent: string,
		customData?: Microsoft.CRM.Omnichannel.IC3Client.Model.IIC3TelemetryCustomData) {
		this.log(Microsoft.CRM.Omnichannel.IC3Client.Model.LogLevel.INFO, telemetryEvent, customData);
	}

	public debug(telemetryEvent: string,
		customData?: Microsoft.CRM.Omnichannel.IC3Client.Model.IIC3TelemetryCustomData) {
		this.log(Microsoft.CRM.Omnichannel.IC3Client.Model.LogLevel.DEBUG, telemetryEvent, customData);
	}

	public warn(telemetryEvent: string,
		customData?: Microsoft.CRM.Omnichannel.IC3Client.Model.IIC3TelemetryCustomData) {
		this.log(Microsoft.CRM.Omnichannel.IC3Client.Model.LogLevel.WARN, telemetryEvent, customData);
	}

	public error(telemetryEvent: string,
		customData?: Microsoft.CRM.Omnichannel.IC3Client.Model.IIC3TelemetryCustomData) {
		this.log(Microsoft.CRM.Omnichannel.IC3Client.Model.LogLevel.ERROR, telemetryEvent, customData);
	}

	private logEvent(logLevel: Microsoft.CRM.Omnichannel.IC3Client.Model.LogLevel, logData: Microsoft.CRM.Omnichannel.IC3Client.Model.IIC3SDKLogData) {
		setTimeout(this.logger.logClientSdkTelemetryEvent.bind(this.logger), 0, logLevel, logData);
	}

	private isLoggingEnabled(): boolean {
		return !!this.logger;
	}
}