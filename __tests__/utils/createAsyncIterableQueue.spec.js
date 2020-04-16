const AbortController = require('abort-controller');
const { default: hasResolved } = require('has-resolved');

const { default: createAsyncIterableQueue, END } = require('../../src/utils/createAsyncIterableQueue');

describe('createAsyncIterableQueue', () => {
  let abortController;
  let end;
  let iterable;
  let iterator;
  let push;
  let watermark;

  beforeEach(() => {
    abortController = new AbortController();

    ({ iterable, end, push, watermark } = createAsyncIterableQueue({ signal: abortController.signal }));

    iterator = iterable[Symbol.asyncIterator]();
  });

  test('iterate 2 items and end', async () => {
    let promise = iterator.next();

    await expect(hasResolved(promise)).resolves.toBe(false);

    push(1);

    await expect(promise).resolves.toEqual({ done: false, value: 1 });
    expect(watermark()).toBe(0);

    promise = iterator.next();

    await expect(hasResolved(promise)).resolves.toBe(false);

    push(2);

    await expect(promise).resolves.toEqual({ done: false, value: 2 });

    end();

    await expect(iterator.next()).resolves.toEqual({ done: true });
  });

  test('iterate 2 backlog items', async () => {
    push(1);
    push(2);

    expect(watermark()).toBe(2);

    await expect(iterator.next()).resolves.toEqual({ done: false, value: 1 });

    expect(watermark()).toBe(1);

    await expect(iterator.next()).resolves.toEqual({ done: false, value: 2 });

    expect(watermark()).toBe(0);
  });

  test('iterate 1 item then abort', async () => {
    let promise = iterator.next();

    push(1);

    await expect(promise).resolves.toEqual({ done: false, value: 1 });

    abortController.abort();

    await expect(iterator.next()).rejects.toThrow('aborted');
  });

  test('start iteration twice should throw "already started" exception', async () => {
    await expect(Promise.race([iterator.next(), iterable[Symbol.asyncIterator]().next()])).rejects.toThrow(
      'already started'
    );
  });

  test('abort with backlog should throw immediately', async () => {
    push(1);
    push(2);

    abortController.abort();

    await expect(iterator.next()).rejects.toThrow('aborted');

    expect(watermark()).toBe(2);
  });
});
