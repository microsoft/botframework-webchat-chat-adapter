import getPlatformBotId from './../../../src/ic3/utils/getPlatformBotId';

describe('getPlatformBotId tests', () => {
    let globalMicrosoftBefore;
    const botType = 'BOT';

    beforeAll(() => {
        spyOn(console, 'warn');
        globalMicrosoftBefore = global.Microsoft;
        global.Microsoft = {
            CRM: {
                Omnichannel: {
                    IC3Client: {
                        Model: {
                            PersonType: {
                                Bot: botType,
                            }
                        }
                    }
                },
            }
        }
    });

    afterAll(() => {
        global.Microsoft = globalMicrosoftBefore;
    });

    test('should return correct id', async () => {
        const botId = 'bot_id';
        const members = [
            {
                displayName: 'Bot',
                id: botId,
                type: botType
            }
        ]
        const conversation = { getMembers: () => members }
        const result = await getPlatformBotId(conversation);
        expect(result).toEqual(botId);
    });

    test('should call console.warn with correct message when no bot', async () => {
        const members = [
            {
                displayName: 'test name',
                id: 'test id',
                type: 'Test type'
            }
        ]
        const conversation = { getMembers: () => members }
        await getPlatformBotId(conversation);
        expect(console.warn).toHaveBeenCalledWith('IC3: Bot ID was not found because the conversation does not have a member with "type" set to "PersonType.Bot".');
    });

    test('should call console.warn with correct message on error', async () => {
        const conversation = { getMembers: () => null }
        try {
            await getPlatformBotId(conversation);
        } catch(e) {
            expect(console.warn).toHaveBeenCalledWith('IC3: Bot ID was not found because Failed to get member list from conversation.', e);
        }
    });
});