import type { Bool } from '@/types';

import { not } from './not';
import { nand } from '../nand';

export function and(a: Bool, b: Bool): Bool {
  return not(nand(a, b));
}
and.gateCounts = {};
