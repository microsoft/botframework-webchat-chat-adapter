enum ActivityType {
  Message = 'message',
  Typing = 'typing'
}

enum Role {
  Bot = 'bot',
  Channel = 'channel',
  Unknown = '',
  User = 'user'
}

type CardAction = {};
type SuggestedActions = { actions: CardAction[]; to?: string[] };

// We are excluding:
// - Date, because it will be stringified as a string via toISOString().
// - function, because it don't stringify and will be ignored.
// - undefined, because it don't stringify, will fail "'key' in obj" check.
type TwoWaySerializablePrimitive = boolean | null | number | string;

// This is more restricted than JSON.
// We want to make sure stringify/parse will return a structure exactly the same.
// However, we cannot define a non-cyclic structure here.
type TwoWaySerializableComplex = {
  [key: string]:
    | TwoWaySerializableComplex
    | TwoWaySerializableComplex[]
    | TwoWaySerializablePrimitive
    | TwoWaySerializablePrimitive[];
};

interface IDirectLineActivity {
  // TODO: Add type "Attachment".
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
  messageid?: string;
  previousClientActivityID?: string;
}

export { ActivityType, Role };
export type {
  CardAction,
  IDirectLineActivity,
  SuggestedActions,
  TwoWaySerializableComplex,
  TwoWaySerializablePrimitive
};
