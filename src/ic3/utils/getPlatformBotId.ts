/// <reference path="../../types/ic3/external/Model.d.ts" />

export default async function getPlatformBotId(
  conversation: Microsoft.CRM.Omnichannel.IC3Client.Model.IConversation
): Promise<string> {
  try {
    const members = await conversation.getMembers();
    const { id } =
      members.find(thisMember => thisMember.type === Microsoft.CRM.Omnichannel.IC3Client.Model.PersonType.Bot) || {};

    if (id) {
      return id;
    }

    console.warn('IC3: Bot ID was not found because the conversation does not have a member with "type" set to "PersonType.Bot".');
  } catch (err) {
    console.warn('IC3: Bot ID was not found because Failed to get member list from conversation.', err);
  }
}
