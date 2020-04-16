module.exports = function observableToArray(observable, { count = Infinity, progress } = {}) {
  let subscription;

  return new Promise((resolve, reject) => {
    let results = [];

    subscription = observable.subscribe({
      complete: () => resolve(results),
      error: reject,
      next: value => {
        results = [...results, value];
        progress && progress(results);
        --count || resolve(results);
      }
    });
  }).finally(() => subscription.unsubscribe());
};
