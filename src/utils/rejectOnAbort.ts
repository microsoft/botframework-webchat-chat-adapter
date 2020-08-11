import createDeferred from 'p-defer-es5';

interface AbortSignal extends EventTarget {
  aborted: boolean;
}

export default function rejectOnAbort(signal: AbortSignal): Promise<void> {
  const abortError = new Error('aborted');

  if (signal && signal.aborted) {
    return Promise.reject(abortError);
  }

  const deferred = createDeferred<void>();
  const handler = () => {
    signal.removeEventListener('abort', handler);
    deferred.reject(abortError);
  };

  signal && signal.addEventListener('abort', handler);

  return deferred.promise;
}
