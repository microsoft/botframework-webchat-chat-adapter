declare enum ActivityType {
    Message = "message",
    Typing = "typing"
}
declare enum Role {
    Bot = "bot",
    Channel = "channel",
    Unknown = "",
    User = "user"
}
declare type CardAction = {};
declare type SuggestedActions = {
    actions: CardAction[];
    to?: string[];
};
declare type TwoWaySerializablePrimitive = boolean | null | number | string;
declare type TwoWaySerializableComplex = {
    [key: string]: TwoWaySerializableComplex | TwoWaySerializableComplex[] | TwoWaySerializablePrimitive | TwoWaySerializablePrimitive[];
};
interface IDirectLineActivity {
    attachments?: any[];
    channelData?: TwoWaySerializableComplex;
    channelId: string;
    conversation: {
        id: string;
    };
    from: {
        id: string;
        name?: string;
        role?: Role;
    };
    id?: string;
    suggestedActions?: SuggestedActions;
    text?: string;
    timestamp: string;
    type: ActivityType;
    value?: any;
}
export { ActivityType, Role };
export type { CardAction, IDirectLineActivity, SuggestedActions, TwoWaySerializableComplex, TwoWaySerializablePrimitive };
