import { Bool, Tuple } from '@/types';

import { and } from '../basic/and';
import { not } from '../basic/not';

export function dmux4way(input: Bool, sel: Tuple<Bool, 2>): Tuple<Bool, 4> {
  return [
    and(input, and(not(sel[0]), not(sel[1]))),
    and(input, and(not(sel[0]), sel[1])),
    and(input, and(sel[0], not(sel[1]))),
    and(input, and(sel[0], sel[1])),
  ];
}
dmux4way.gateCounts = {};
