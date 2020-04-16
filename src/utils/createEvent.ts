import entries from 'core-js/features/object/entries';

export default function createEvent(type: string, eventInitDict?: { [key: string]: any }) {
  if (typeof Event === 'function') {
    return new Event(type, eventInitDict);
  }

  const event = document.createEvent('CustomEvent');

  event.initCustomEvent(type, true, true, undefined);

  entries(eventInitDict).forEach(([key, value]) => {
    (event as any)[key] = value;
  });

  return event;
}
