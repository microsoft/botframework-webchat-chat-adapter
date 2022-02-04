import {addToMessageIdMap, alreadyAcked} from './../../../src/utils/ackedMessageMap.ts'
import { clearAll, removeFromMessageIdMap } from './../../../src/utils/ackedMessageMap';

import uniqueId from './../../../src/ic3/utils/uniqueId';

describe('ackMessageMap test suite', () => {
    test('out of ttl entries should be cleared', () => {
        for(let i = 0; i<5000; i ++) {
            addToMessageIdMap(uniqueId());
        }
        let uid = uniqueId();
        addToMessageIdMap(uid, Date.now() - 3 * 60 * 1000);
        let result = alreadyAcked(uid);
        expect(result).toBeTruthy();
        addToMessageIdMap("e9a18310-2080-4149-bced-4aa3afe8f995");
        result = alreadyAcked(uid)
        expect(result).toBeFalsy();
        clearAll();
    });

    test('non expired entries should NOT be cleared', () => {
        for(let i = 0; i<5000; i ++) {
            addToMessageIdMap(uniqueId());
        }
        let uid = uniqueId();
        addToMessageIdMap(uid, Date.now() - 1 * 60 * 1000);
        let result = alreadyAcked(uid);
        expect(result).toBeTruthy();
        addToMessageIdMap("e9a18310-2080-4149-bced-4aa3afe8f995");
        result = alreadyAcked(uid)
        expect(result).toBeTruthy();
        clearAll();
    });

    test('can successfully add message to the map', () => {
        let uid = uniqueId();
        addToMessageIdMap(uid);
        let result = alreadyAcked(uid);
        expect(result).toBeTruthy();
        removeFromMessageIdMap(uid);
    });

    test('can successfully verify a message not in the map', () => {
        let uid = "25bd2632-788a-48ba-9ac8-a0a8b0ac9eb3";
        addToMessageIdMap(uid);
        let result = alreadyAcked("88b40926-5d27-4dee-bce6-536c5ca563bd");
        expect(result).toBeFalsy();
        removeFromMessageIdMap(uid);
    });
});
