import type { Bool } from '@/gates';

import { nand } from '../nand';
import { not } from './not';

export function and(a: Bool, b: Bool): Bool {
  return not(nand(a, b));
}
and.gateCounts = {};
