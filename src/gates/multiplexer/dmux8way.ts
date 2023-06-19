import { Bool, Tuple } from '@/types';

import { and } from '../basic/and';
import { not } from '../basic/not';

export function dmux8way(input: Bool, sel: Tuple<Bool, 3>): Tuple<Bool, 8> {
  return [
    and(input, and(not(sel[0]), and(not(sel[1]), not(sel[2])))),
    and(input, and(not(sel[0]), and(not(sel[1]), sel[2]))),
    and(input, and(not(sel[0]), and(sel[1], not(sel[2])))),
    and(input, and(not(sel[0]), and(sel[1], sel[2]))),
    and(input, and(sel[0], and(not(sel[1]), not(sel[2])))),
    and(input, and(sel[0], and(not(sel[1]), sel[2]))),
    and(input, and(sel[0], and(sel[1], not(sel[2])))),
    and(input, and(sel[0], and(sel[1], sel[2]))),
  ];
}
dmux8way.gateCounts = {};
