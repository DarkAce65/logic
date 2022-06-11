import type { Bool } from '../main';

import { nand } from './nand';

export function not(a: Bool): Bool {
  return nand(a, 1);
}
