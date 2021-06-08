declare namespace Microsoft.CRM.Omnichannel.IC3Client.Model {
  class ConversationGenerator {
    private messagesObservers;
    private fileMessagesObservers;
    constructor();
    generateMessage(conversationId: string, message: IMessage): void;
    generateFileMessage(conversationId: string, message: IMessage, file: File): void;
    subscribeToMessages(subscriber: (conversation: IConversation, message: IMessage) => void): void;
    subscribeToFileMessages(subscriber: (conversation: IConversation, message: IMessage, file: File) => void): void;
  }
}

declare namespace Microsoft.CRM.Omnichannel.IC3Client.Model {
  class ResourceType {
      static readonly NewMessage = "NewMessage";
      static readonly MessageUpdate = "MessageUpdate";
      static readonly UserPresence = "UserPresence";
      static readonly ConversationUpdate = "ConversationUpdate";
      static readonly ThreadUpdate = "ThreadUpdate";
  }
}

declare namespace Microsoft.CRM.Omnichannel.IC3Client.Model {
  enum PersonType {
    Unknown = 0,
    User = 1,
    Bot = 2
  }
}

declare namespace Microsoft.CRM.Omnichannel.IC3Client.Model {
  enum TypingStatus {
    Typing = 0,
    ClearTyping = 1
  }
}

declare namespace Microsoft.CRM.Omnichannel.IC3Client.Model {
  enum FileStatus {
    Unknown = 0,
    InProgress = 1,
    Success = 2,
    Error = 3
  }
}

declare namespace Microsoft.CRM.Omnichannel.IC3Client.Model {
  enum FileSharingProtocolType {
    AmsBasedFileSharing = 0
  }
}

declare namespace Microsoft.CRM.Omnichannel.IC3Client.Model {
  class DeliveryMode {
    static readonly Bridged = 'bridged';
    static readonly Unbridged = 'unbridged';
  }
}

declare namespace Microsoft.CRM.Omnichannel.IC3Client.Model {
  class MessageContentType {
    static readonly RichText = 'RichText';
    static readonly Text = 'Text';
  }
}

declare namespace Microsoft.CRM.Omnichannel.IC3Client.Model {
  class MessageType {
    static readonly UserMessage = 'UserMessage';
    static readonly SwiftCard = 'SwiftCard';
    static readonly Typing = 'Control/Typing';
    static readonly ClearTyping = 'Control/ClearTyping';
    static readonly LiveState = "Control/LiveState";
  }
}

declare namespace Microsoft.CRM.Omnichannel.IC3Client.Model {
  class ProtocolType {
    static readonly IC3V1SDK = 0;
    static readonly IC3V2SDK = 1;
    static readonly MockIC3SDK = 2;
  }
}

declare namespace Microsoft.CRM.Omnichannel.IC3Client.Model {
  class HostType {
    static readonly IFrame = 0;
    static readonly Page = 1;
  }
}

declare namespace Microsoft.CRM.Omnichannel.IC3Client.Model {
  interface IFileMetadata {
    id: string;
    name: string;
    type: string;
    size: number;
    url: string;
    fileSharingProtocolType: FileSharingProtocolType;
  }
}

declare namespace Microsoft.CRM.Omnichannel.IC3Client.Model {
  interface ILogData {
    /**
     * The telemetry event to log
     */
    event: string;
    /**
     * The event description
     */
    description?: string;
    /**
     * The type of the event
     */
    eventType: string;
    /**
     * The additional data which needs to be logged
     */
    customData?: any;
    /**
     * The global telemetry context for the event to be logged
     */
    globalTelemetryContext: IGlobalTelemetryContext;
    /**
     * The sdk telemetry context for the event to be logged
     */
    sdkTelemetryContext: ISDKTelemetryContext;
    /**
     * The conversation telemetry context for the event to be logged
     */
    conversationTelemetryContext: IConversationTelemetryContext;
    /**
     * The event log time in ISO format
     */
    eventLogTime: string;
    /**
     * The execution time of the event
     */
    executionTime?: number;
    /**
     * The error which needs to be logged
     */
    error?: Error;
  }

  interface IIC3SDKLogData {
    Description?: string;
    SubscriptionId?: string;
    EndpointUrl?: string;
    EndpointId?: string;
    ElapsedTimeInMilliseconds?: number;
    Event?: string;
    ErrorCode?: string;
    ExceptionDetails?: object;
    ShouldBubbleToHost?: boolean;
    CustomProperties?: string;
  }

  interface IIC3TelemetryCustomData {
    ElapsedTimeInMilliseconds?: number;
    ErrorCode?: string;
    EndpointUrl?: string;
    EndpointId?: string;
    ExceptionDetails?: object;
    Description?: string;
    ShouldBubbleToHost?: boolean;
  }
}

declare namespace Microsoft.CRM.Omnichannel.IC3Client.Model {
  interface IConversationTelemetryContext {
    id: string;
  }
}

declare namespace Microsoft.CRM.Omnichannel.IC3Client.Model {
  interface ILogger {
    logClientSdkTelemetryEvent(loglevel: LogLevel, event: IIC3SDKLogData): void;
  }
}

declare namespace Microsoft.CRM.Omnichannel.IC3Client.Model {
  interface IBotMessage {
    [key: string]: any;
  }
}

declare namespace Microsoft.CRM.Omnichannel.IC3Client.Model {
  interface IThread {
      id: string;
      type: string;
      properties: any;
      members: any[];
      version: number;
      messages: string;
      rosterVersion: number;
  }
}

declare namespace Microsoft.CRM.Omnichannel.IC3Client.Model {
  enum LogLevel {
    INFO = 'INFO',
    DEBUG = 'DEBUG',
    WARN = 'WARN',
    ERROR = 'ERROR'
  }
}

declare namespace Microsoft.CRM.Omnichannel.IC3Client.Model {
  interface ISDKTelemetryContext {
    hostType: string;
    protocolType: string;
    id: string;
  }
}

declare namespace Microsoft.CRM.Omnichannel.IC3Client.Model {
  interface IGlobalTelemetryContext {
    sdkUrl: string;
    sdkVersion: string;
  }
}

declare namespace Microsoft.CRM.Omnichannel.IC3Client.Model {
  interface IPerson {
    displayName: string;
    id: string;
    type: PersonType;
  }
}

declare namespace Microsoft.CRM.Omnichannel.IC3Client.Model {
  interface IMessageProperties {
    [id: string]: string;
  }
}

declare namespace Microsoft.CRM.Omnichannel.IC3Client.Model {
  interface IMessage {
    //(DO NOT DELETE THIS COMMENT)messageid: represents server side IC3 message id. Available as id field in 'poll' rest api response. 
    //Unlike 'clientmessageid',Always available in messages after conversation close.
    messageid?: string;
    clientmessageid?: string;
    content: string;
    contentType: MessageContentType;
    messageType: MessageType;
    sender: IPerson;
    timestamp: Date;
    properties?: IMessageProperties;
    tags?: string[];
    deliveryMode: DeliveryMode;
    fileMetadata?: IFileMetadata;
    resourceType?: ResourceType;
  }
}

declare namespace Microsoft.CRM.Omnichannel.IC3Client.Model {
  interface IConversation {
    id: string;
    sendMessage(message: IMessage): Promise<void>;
    getMessages(): Promise<IMessage[]>;
    registerOnNewMessage(callback: (message: IMessage) => void): Promise<void>;
    registerOnThreadUpdate(callback: (message: IThread) => void): Promise<void>;
    registerOnIC3Error(callback: (error: any) => void): Promise<void>;
    disconnect(): Promise<void>;
    downloadFile(fileMetadata: IFileMetadata): Promise<Blob>;
    getFileStatus(fileMetadata: IFileMetadata): Promise<FileStatus>;
    indicateTypingStatus(typingStatus: TypingStatus, optionalProperties?: IMessageProperties): Promise<void>;
    sendFileMessage(fileMedata: Model.IFileMetadata, message: IMessage): Promise<void>;
    sendMessageToBot(botId: string, botMessage: IBotMessage): Promise<void>;
    getMembers(): Promise<IPerson[]>;
    uploadFile(fileToSend: File, fileSharingProtocolType?: FileSharingProtocolType): Promise<IFileMetadata>;
  }
}

declare namespace Microsoft.CRM.Omnichannel.IC3Client.Model {
  interface IClientSDKInitializationParameters {
    hostType: HostType;
    protocolType: ProtocolType;
    logger?: ILogger;
    documentbody?: string;
  }
}

declare namespace Microsoft.CRM.Omnichannel.IC3Client.Model {
  interface IInitializationInfo {
    token?: string;
    regionGtms?: IRegionGtms;
    conversationGenerator?: ConversationGenerator;
    visitor?: boolean;
    forceStart?: boolean;
  }
}

declare namespace Microsoft.CRM.Omnichannel.IC3Client.Model {
  interface IRegionGtms {
    ams: string;
    drad: string;
    chatService: string;
    middleTier: string;
    mtImageService: string;
    search: string;
    searchTelemetry: string;
    urlp: string;
    unifiedPresence: string;
    userProfileService: string;
  }
}

declare namespace Microsoft.CRM.Omnichannel.IC3Client.Model {
  interface ISDK {
    id: string;
    initialize(sessionInfo: IInitializationInfo): Promise<void>;
    update(sessionInfo: IInitializationInfo): Promise<void>;
    dispose(): Promise<void>;
    getPreviousPollingStartTime(): Promise<number>;
    registerOnIC3ErrorRecovery(callback: (error: any) => void): Promise<void>; // tslint:disable-line:no-any
    registerOnIC3FatalError(callback: (error: any) => void): Promise<void>; // tslint:disable-line:no-any
    joinConversation(conversationId: string, sendHeartBeat?: boolean): Promise<IConversation>;
  }
}
