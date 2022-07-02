import type { Bool } from '@/types';

import { nand } from '../nand';

export function not(a: Bool): Bool {
  return nand(a, 1);
}
not.gateCounts = {};
