import { Bool } from '@/gates';

import { and } from './and';
import { not } from './not';

export function dmux(input: Bool, sel: Bool): [Bool, Bool] {
  return [and(input, not(sel)), and(input, sel)];
}
dmux.gateCounts = {};
