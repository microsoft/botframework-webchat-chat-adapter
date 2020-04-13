import entries from 'core-js/features/object/entries';

export default function promiseRaceMap(map: { [key: string]: Promise<any> }): Promise<any> {
  return Promise.race(entries(map).map(([key, promise]) => promise.then(result => ({ [key]: result }))));
}
