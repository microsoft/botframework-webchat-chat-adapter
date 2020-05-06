/// <reference path="../../src/types/external.d.ts" />
export declare type AsyncIterableQueue<T> = {
    end(): void;
    iterable: AsyncIterable<T>;
    push(value: T): void;
    watermark(): number;
};
export declare type AsyncIterableQueueOptions = {
    signal?: AbortSignal;
};
export default function createAsyncIterableQueue<T>(options?: AsyncIterableQueueOptions): AsyncIterableQueue<T>;
