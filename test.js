const Observable = require("core-js/features/observable");

function firstObservation(observable) {
  let subscription;

  return new Promise((resolve, reject) => {
    subscription = observable.subscribe({
      complete() {
        reject(new Error("No result were received."));
      },

      error: reject,
      next: resolve,

      start(thisSubscription) {
        subscription = thisSubscription;
      },
    });
  }).finally(() => subscription.unsubscribe());
}

// Usage

// const id = await firstObservation(directLine.postActivity({}));

(async function () {
  const id = await firstObservation(Observable.from([1, 2, 3]));

  console.log(id);
})().catch(() => {});
