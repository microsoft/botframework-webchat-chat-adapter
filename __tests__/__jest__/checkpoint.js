import createDeferred from 'p-defer-es5';

export default function checkpoint() {
  const { promise: promise1, resolve: resolve1 } = createDeferred();
  const { promise: promise2, resolve: resolve2 } = createDeferred();

  return {
    pause: async () => {
      await promise1;
      resolve2();
    },

    resume: async () => {
      resolve1();
      await promise2;
    }
  };
};
