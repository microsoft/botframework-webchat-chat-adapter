const messageIdSet = new Set<string>();

export function addToMessageIdSet(clientmessageid: string) {
    messageIdSet.add(clientmessageid);
}

export function removeFromMessageIdSet(clientmessageid: string) {
    if (messageIdSet.has(clientmessageid)) {
        messageIdSet.delete(clientmessageid);
    }
}

export function alreadyAcked(clientmessageid: string) {
    return messageIdSet.has(clientmessageid);
}