declare module 'abort-controller-es5' {
  export default class AbortController {
    abort(): void;
    signal: AbortSignal
  }
}

declare module 'core-js/features/observable' {
  export default class Observable<T> {
    constructor(observerCallback: (observer: Observer<T>) => void) {}
  }

  export class Observer<T> {
    complete(): void;
    error(error: Error): void;
    next(value: T): void;
  }
}

declare module 'event-target-shim-es5' {
  export default class EventTarget {
    addEventListener(name: string, listener: EventListener): void;
    dispatchEvent(event: Event): boolean;
    removeEventListener(name: string, listener: EventListener): void;
  }

  export type EventListener = (event: Event) => void;
}
