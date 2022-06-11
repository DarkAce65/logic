import type { Bool } from '../main';

import { nand } from './nand';
import { not } from './not';

export function and(a: Bool, b: Bool): Bool {
  return not(nand(a, b));
}
