enum StateKey {
  BotId = 'ic3.botId',
  UserDisplayName = 'ic3.userDisplayName',
  UserId = 'ic3.userId'
}

export { StateKey };

export type IC3AdapterState = {
  [StateKey.BotId]: string;
  [StateKey.UserDisplayName]: string;
  [StateKey.UserId]: string;
};
