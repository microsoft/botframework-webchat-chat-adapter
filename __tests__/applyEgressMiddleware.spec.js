const { default: createAdapter } = require('../src/createAdapter');
const { default: applyEgressMiddleware } = require('../src/applyEgressMiddleware');

test('1 async middleware', async () => {
  const adapter = createAdapter(
    {},
    applyEgressMiddleware(() => next => async (activity, options) =>
      new Promise(resolve => {
        setImmediate(() => options.progress({ ...activity, id: '1' }));
        setImmediate(resolve);
      })
    )
  );

  const progress = jest.fn();

  await adapter.egress({ value: 1 }, { progress });

  expect(progress).toHaveBeenCalledTimes(1);

  expect(progress).toHaveBeenCalledWith(
    expect.objectContaining({
      id: '1',
      value: 1
    })
  );
});

test('1 egress become 2 egresses', async () => {
  const finalEgress = jest.fn();

  const adapter = createAdapter(
    {},
    applyEgressMiddleware(
      () => next => async activity => {
        next(activity);
        next(activity * 10);
      },
      () => () => finalEgress
    )
  );

  await adapter.egress(1);

  expect(finalEgress).toHaveBeenCalledTimes(2);

  expect(finalEgress).toHaveBeenNthCalledWith(1, 1);
  expect(finalEgress).toHaveBeenNthCalledWith(2, 10);
});

test('no middleware should throw exception on egress', async () => {
  const adapter = createAdapter(
    {},
    applyEgressMiddleware()
  );

  await expect(adapter.egress(1)).rejects.toThrow('no enhancers registered');
});
