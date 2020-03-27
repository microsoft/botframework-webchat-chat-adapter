interface IObserver<T> {
  complete(): void;
  error(error: Error): void;
  next(value: T): void;
}

export { IObserver };
