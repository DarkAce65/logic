import type { Bool } from '../main';

import { and } from './and';
import { nand } from './nand';
import { or } from './or';

export function xor(a: Bool, b: Bool): Bool {
  return and(or(a, b), nand(a, b));
}
