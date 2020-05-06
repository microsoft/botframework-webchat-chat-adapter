interface AbortSignal extends EventTarget {
    aborted: boolean;
}
export default function rejectOnAbort(signal: AbortSignal): Promise<void>;
export {};
