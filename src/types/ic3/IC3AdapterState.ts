enum StateKey {
  BotId = 'ic3.botId',
  Conversation = 'ic3.conversation',
  UserDisplayName = 'ic3.userDisplayName',
  UserId = 'ic3.userId',
  AdapterSequenceNo = 'ic3.adapterSequenceNo',
  Deprecated = 'ic3.deprecated'
}

export { StateKey };

export type IC3AdapterState = {
  [StateKey.BotId]: string;
  [StateKey.Conversation]: any;
  [StateKey.UserDisplayName]: string;
  [StateKey.UserId]: string;
  [StateKey.AdapterSequenceNo]: number;
  [StateKey.Deprecated]: boolean;
};
