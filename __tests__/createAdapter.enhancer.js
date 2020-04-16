const { default: createAdapter } = require('../src/index');

test('passing a class object to enhancer should throw', async () => {
  class EnhancedAdapter {}

  expect(() => createAdapter({}, () => () => new EnhancedAdapter())).toThrow('class object');
});
