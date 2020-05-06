/// <reference path="../../src/types/external.d.ts" />
import Observable from 'core-js/features/observable';
export default function shareObservable<T>(observable: Observable<T>): Observable<T>;
