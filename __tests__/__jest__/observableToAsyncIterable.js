// const createDeferred = require('p-defer');
// const abortSignalToPromise = require('./abortSignalToPromise');

// module.exports = function observableToAsyncIterable(observable, { signal } = {}) {
//   const aborted = abortSignalToPromise(signal);
//   const queue = [];
//   let nextDeferred;

//   const push = value => {
//     queue.push(value);
//     nextDeferred && nextDeferred.resolve();
//   };

//   const subscription = observable.subscribe({
//     complete: () => push({ complete: {} }),
//     error: error => push({ error }),
//     next: next => push({ next })
//   });

//   return {
//     async *[Symbol.asyncIterator]() {
//       try {
//         for (;;) {
//           if (!queue.length) {
//             await Promise.race([(nextDeferred || (nextDeferred = createDeferred())).promise, aborted]);

//             nextDeferred = null;
//           }

//           const { complete, error, next } = queue.shift();

//           if (complete) {
//             break;
//           } else if (error) {
//             throw error;
//           }

//           yield next;
//         }
//       } finally {
//         subscription.unsubscribe();
//       }
//     }
//   };
// };
