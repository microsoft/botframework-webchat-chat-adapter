export enum TelemetryEvents {
	CHAT_TOKEN_NOT_FOUND = "ADAPTER_CHAT_TOKEN_NOT_FOUND",
	IC3_SDK_NOT_FOUND = "ADAPTER_IC3_SDK_NOT_FOUND",
	IC3_SDK_INITIALIZE_STARTED = "ADAPTER_IC3_SDK_INITIALIZE_STARTED",
	IC3_SDK_INITIALIZE_SUCCESS = "ADAPTER_IC3_SDK_INITIALIZE_SUCCESS",
	IC3_SDK_INITIALIZE_FAILURE = "ADAPTER_IC3_SDK_INITIALIZE_FAILURE",
	IC3_SDK_JOIN_CONVERSATION_STARTED = "ADAPTER_IC3_SDK_JOIN_CONVERSATION_STARTED",
	IC3_SDK_JOIN_CONVERSATION_SUCCESS = "ADAPTER_IC3_SDK_JOIN_CONVERSATION_SUCCESS",
	UNKNOWN_MESSAGE_TYPE = "ADAPTER_UNKNOWN_MESSAGE_TYPE",
	UNKNOWN_THREAD_TYPE = "ADAPTER_UNKNOWN_THREAD_TYPE",
	CONVERSATION_NOT_FOUND = "ADAPTER_CONVERSATION_NOT_FOUND",
	FETCH_ATTACHMENT_FAILED = "ADAPTER_FETCH_ATTACHMENT_FAILED",
	REHYDRATE_MESSAGES = "ADAPTER_REHYDRATE_MESSAGES",
	REGISTER_ON_NEW_MESSAGE = "ADAPTER_REGISTER_ON_NEW_MESSAGE",
	REGISTER_ON_THREAD_UPDATE = "ADAPTER_REGISTER_ON_THREAD_UPDATE",
	REGISTER_ON_IC3_ERROR = "REGISTER_ON_IC3_ERROR",
	GET_MESSAGES_SUCCESS = "ADAPTER_GET_MESSAGES_SUCCESS",
	SEND_MESSAGE_SUCCESS = "ADAPTER_SEND_MESSAGE_SUCCESS",
	SEND_FILE_SUCCESS  = "ADAPTER_SEND_FILE_SUCCESS",
	SEND_TYPING_SUCCESS  = "ADAPTER_SEND_TYPING_SUCCESS",
	ADAPTIVE_CARD_PROCESSING_ERROR  = "ADAPTER_ADAPTIVE_CARD_PROCESSING_ERROR",
	MESSAGE_RECEIVED  = "ADAPTER_MESSAGE_RECEIVED",
	MESSAGE_POSTED_TO_EGRESS = "MESSAGE_POSTED_TO_EGRESS",
	THREAD_UPDATE_RECEIVED  = "ADAPTER_THREAD_UPDATE_RECEIVED",
	IC3_ERROR_RECEIVED  = "IC3_ERROR_RECEIVED",
	ADAPTER_NOT_READY = "ADAPTER_NOT_READY",
	ADAPTER_STATE_UPDATE = "ADAPTER_STATE_UPDATE",
	ADAPTER_UNSUBSCRIBED = "ADAPTER_UNSUBSCRIBED",
	TRIGGER_IC3_FATAL_ERROR = "TRIGGER_IC3_FATAL_ERROR",
	REGISTER_ON_IC3_ERROR_RECOVERY = "REGISTER_ON_IC3_ERROR_RECOVERY",
	ADAPTER_DL_INTERFACE_EVENT = "ADAPTER_DL_INTERFACE_EVENT",
	CREATE_ADAPTER_EVENT = "CREATE_ADAPTER_EVENT",
	SHARE_OBSERVABLE_EVENT = "SHARE_OBSERVABLE_EVENT"
}