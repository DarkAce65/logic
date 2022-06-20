import type { Bool } from '../gates';

import { nand } from './nand';
import { not } from './not';

export function or(a: Bool, b: Bool): Bool {
  return nand(not(a), not(b));
}
or.gateCounts = {};
