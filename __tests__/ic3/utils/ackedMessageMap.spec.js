import * as sendingMessageMapClass from './../../../src/utils/sendingMessageMap.ts'

import uniqueId from './../../../src/ic3/utils/uniqueId';

describe('sendingMessageMap test suite', () => {
    test('clear the map if 5000 message inserted', () => {
        for(let i = 0; i<=5000; i ++) {
            sendingMessageMapClass.addToSendingMessageIdMap(uniqueId(), {});
        }
        expect(sendingMessageMapClass.size()).toBe(5001);
        sendingMessageMapClass.addToSendingMessageIdMap(uniqueId(), {});
        expect(sendingMessageMapClass.size()).toBe(1);
    });

    test('can successfully add message to the map', () => {
        let uid = uniqueId();
        sendingMessageMapClass.addToSendingMessageIdMap(uid, {});
        let result = sendingMessageMapClass.isStillSending(uid);
        expect(result).toBeTruthy();
        sendingMessageMapClass.removeFromSendingMessageIdMap(uid);
    });

    test('can successfully verify a message not in the map', () => {
        let uid = "25bd2632-788a-48ba-9ac8-a0a8b0ac9eb3";
        sendingMessageMapClass.addToSendingMessageIdMap(uid, {});
        let result = sendingMessageMapClass.isStillSending("88b40926-5d27-4dee-bce6-536c5ca563bd");
        expect(result).toBeFalsy();
        sendingMessageMapClass.removeFromSendingMessageIdMap(uid);
    });
});
