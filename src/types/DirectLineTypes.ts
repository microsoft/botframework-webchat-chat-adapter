enum ActivityType {
  Message = 'message',
  Typing = 'typing'
}

enum SenderRole {
  Bot = 'bot',
  Channel = 'channel',
  Unknown = '',
  User = 'user'
}

type CardAction = {};
type SuggestedActions = { actions: CardAction[]; to?: string[] };

interface IDirectLineActivity {
  // TODO: Add type "Attachment".
  attachment?: any[];
  channelData?: {
    [key: string]: boolean | number | string | boolean[] | number[] | string[];
  };
  channelId: string;
  conversation: {
    id: string;
  };
  from: {
    id: string;
    name?: string;
    role?: SenderRole;
  };
  id?: string;
  suggestedActions?: SuggestedActions;
  text?: string;
  timestamp: string;
  type: ActivityType;
  value?: any;
}

export { ActivityType, SenderRole };
export type { CardAction, IDirectLineActivity, SuggestedActions };
