import type { Bool } from '@/types';

import { and } from './and';
import { or } from './or';
import { nand } from '../nand';

export function xor(a: Bool, b: Bool): Bool {
  return and(or(a, b), nand(a, b));
}
xor.gateCounts = {};
