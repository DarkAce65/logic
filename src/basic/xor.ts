import type { Bool } from '../gates';

import { and } from './and';
import { nand } from './nand';
import { or } from './or';

export function xor(a: Bool, b: Bool): Bool {
  return and(or(a, b), nand(a, b));
}
xor.gateCounts = {};
