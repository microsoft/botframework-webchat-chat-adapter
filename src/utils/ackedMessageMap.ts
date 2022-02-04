const messageIdMap = new Map<string, number>();
const MAX_CAPACITY = 5000;
const TTL = 2 * 60 * 1000; // default: 2 mins, if a message receipt cannot be received within 2mins after been delivered, it is highly possible that polling had failed.

function checkAndCleanMap() {
    if (messageIdMap.size > MAX_CAPACITY) {
        messageIdMap.forEach((timestamp: number, messageId: string, map: Map<string, number>) => {
            if ((Date.now() - timestamp) > TTL) {
                map.delete(messageId);
            }
        })
    }
}

export function addToMessageIdMap(clientmessageid: string, date = Date.now()) {
    checkAndCleanMap();
    messageIdMap.set(clientmessageid, date);
}

export function removeFromMessageIdMap(clientmessageid: string) {
    if (messageIdMap.has(clientmessageid)) {
        messageIdMap.delete(clientmessageid);
    }
}

export function alreadyAcked(clientmessageid: string) {
    return messageIdMap.has(clientmessageid);
}

export function clearAll() {
    messageIdMap.clear();
}