const { default: createAdapter, CLOSED, CONNECTING, OPEN } = require('../src/index');

describe('createAdapter.eventTarget', () => {
  let adapter;
  let setReadyState;

  beforeEach(() => {
    adapter = createAdapter(
      {},
      next => options => {
        const adapter = next(options);

        setReadyState = adapter.setReadyState;

        return adapter;
      }
    );
  });

  describe('for events', () => {
    let events;
    let handleEvent;

    beforeEach(() => {
      events = [];
      handleEvent = ({ type }) => events.push(type);

      adapter.addEventListener('error', handleEvent);
      adapter.addEventListener('open', handleEvent);
    });

    describe.each([
      ['"OPEN"', [OPEN], ['open']],
      ['"OPEN" then "CONNECTING"', [OPEN, CONNECTING], ['open', 'error']],
      ['"OPEN", "CONNECTING" then "OPEN"', [OPEN, CONNECTING, OPEN], ['open', 'error', 'open']],
      ['"OPEN", then "CLOSED"', [OPEN, CLOSED], ['open', 'error']]
    ])('setReadyState to %s', (_, readyStates, expected) => {
      test(`should dispatch ${expected.map(type => `"${type}"`).join(', ')} events`, () => {
        readyStates.forEach(setReadyState);

        expect(events).toEqual(expected);
      });
    });

    test.each([
      ['OPEN', OPEN],
      ['CONNECTING', CONNECTING]
    ])('setReadyState to "OPEN", "CLOSED", then "%s" should throw', (_, readyState) => {
      setReadyState(OPEN);
      setReadyState(CLOSED);

      expect(() => setReadyState(readyState)).toThrow('it is CLOSED');
    });

    test('setReadyState to OPEN should only call setReadyState once', () => {
      setReadyState(OPEN);
      setReadyState(OPEN);

      expect(events).toEqual(['open']);
    });
  });

  test('setReadyState to -1 should throw', () => {
    expect(() => setReadyState(-1)).toThrow('must be either');
  });
});
