const messageIdMap = new Map<string, any>();
const MAX_CAPACITY = 5000;

function checkAndCleanSendingMessageMap() {
    if (messageIdMap.size > MAX_CAPACITY) {
        clearAll();
    }
}

export function addToSendingMessageIdMap(clientmessageid: string, activity: any) {
    checkAndCleanSendingMessageMap();
    messageIdMap.set(clientmessageid, activity);
}

export function removeFromSendingMessageIdMap(clientmessageid: string) {
    if (isStillSending(clientmessageid)) {
        messageIdMap.delete(clientmessageid);
    }
}

export function getMessageFromSendingMap(clientmessageid: string) {
    if (isStillSending(clientmessageid)) {
        return messageIdMap.get(clientmessageid);
    }
    return null;
}

export function isStillSending(clientmessageid: string) {
    return messageIdMap.has(clientmessageid);
}

export function size() {
    return messageIdMap.size;
}

export function clearAll() {
    messageIdMap.clear();
}