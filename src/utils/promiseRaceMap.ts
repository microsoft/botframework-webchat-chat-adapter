/// <reference path="../types/external.d.ts" />

import entries from 'core-js/features/object/entries';

export default function promiseRaceMap(map: { [key: string]: Promise<any> }): Promise<any> {
  return Promise.race(
    entries(map).map(([key, promise]: [string, Promise<any>]) => promise.then(result => ({ [key]: result })))
  );
}
