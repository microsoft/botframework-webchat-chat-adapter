/// <reference path="../../types/external.d.ts" />

import random from 'math-random';

export default function uniqueId() {
  return random().toString(36).substr(2);
}
