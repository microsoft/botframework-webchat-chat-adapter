export default function observableToArray(observable, { count = Infinity, progress, signal } = {}) {
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

    signal &&
      signal.addEventListener('abort', () => {
        subscription.unsubscribe();
        reject(new Error('aborted'));
      });
  }).finally(() => subscription.unsubscribe());
};
