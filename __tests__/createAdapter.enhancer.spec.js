import createAdapter from '../src/index';

test('passing a class object to enhancer should throw', () => {
  class EnhancedAdapter {}

  expect(() => createAdapter({}, () => () => new EnhancedAdapter())).toThrow('class object');
});

test('setReadyState should not be exposed', () => {
  expect(createAdapter().setReadyState).toBeUndefined();
});
