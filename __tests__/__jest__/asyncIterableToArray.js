module.exports = async function asyncIterableToArray(iterable, count = Infinity) {
  const results = [];

  for await (const value of iterable) {
    results.push(value);

    if (!--count) {
      break;
    }
  }

  return results;
};
