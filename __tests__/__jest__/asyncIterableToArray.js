module.exports = async function asyncIterableToArray(iterable) {
  const results = [];

  for await (const value of iterable) {
    results.push(value);
  }

  return results;
};
