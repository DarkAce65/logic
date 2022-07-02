import type { Bool } from '@/gates';

import { nand } from '../nand';

export function not(a: Bool): Bool {
  return nand(a, 1);
}
not.gateCounts = {};
