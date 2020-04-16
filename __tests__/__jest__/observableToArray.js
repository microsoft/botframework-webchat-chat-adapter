module.exports = function observableToArray(observable, count = Infinity) {
  let subscription;

  return new Promise((resolve, reject) => {
    const results = [];

    subscription = observable.subscribe({
      complete: () => resolve(results),
      error: reject,
      next: value => {
        results.push(value);
        --count || resolve(results);
      }
    });
  }).finally(() => subscription.unsubscribe());
};
