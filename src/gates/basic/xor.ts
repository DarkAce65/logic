import type { Bool } from '@/types';

import { nand } from '../nand';
import { and } from './and';
import { or } from './or';

export function xor(a: Bool, b: Bool): Bool {
  return and(or(a, b), nand(a, b));
}
xor.gateCounts = {};
