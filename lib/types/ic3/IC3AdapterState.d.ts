declare enum StateKey {
    BotId = "ic3.botId",
    Conversation = "ic3.conversation",
    UserDisplayName = "ic3.userDisplayName",
    UserId = "ic3.userId"
}
export { StateKey };
export declare type IC3AdapterState = {
    [StateKey.BotId]: string;
    [StateKey.Conversation]: any;
    [StateKey.UserDisplayName]: string;
    [StateKey.UserId]: string;
};
