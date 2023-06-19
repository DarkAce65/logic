import type { Bool } from '@/types';

import { not } from './not';
import { nand } from '../nand';

export function or(a: Bool, b: Bool): Bool {
  return nand(not(a), not(b));
}
or.gateCounts = {};
