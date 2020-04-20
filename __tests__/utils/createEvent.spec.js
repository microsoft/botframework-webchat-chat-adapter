import createEvent from '../../src/utils/createEvent';

describe.each([['document.createEvent', { noGlobalEvent: true }], ['new Event']])(
  'createEvent using %s',
  (_, { noGlobalEvent } = {}) => {
    let globalEvent;

    beforeEach(() => {
      globalEvent = global.Event;

      if (noGlobalEvent) {
        global.Event = {};
      }
    });

    afterEach(() => {
      global.Event = globalEvent;
    });

    test('createEvent', () => {
      const extra = {};
      const event = createEvent('load', { extra });

      expect(event).toHaveProperty('type', 'load');

      // Unsupported fields can only be set through createEvent()
      if (noGlobalEvent) {
        expect(event).toHaveProperty('extra', extra);
      }
    });
  }
);
