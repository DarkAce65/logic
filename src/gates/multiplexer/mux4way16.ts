import { Bool, Tuple } from '@/types';

import { mux } from '../basic/mux';

export function mux4way16(
  a: Tuple<Bool, 16>,
  b: Tuple<Bool, 16>,
  c: Tuple<Bool, 16>,
  d: Tuple<Bool, 16>,
  sel: Tuple<Bool, 2>
): Tuple<Bool, 16> {
  return [
    mux(mux(a[0], b[0], sel[1]), mux(c[0], d[0], sel[1]), sel[0]),
    mux(mux(a[1], b[1], sel[1]), mux(c[1], d[1], sel[1]), sel[0]),
    mux(mux(a[2], b[2], sel[1]), mux(c[2], d[2], sel[1]), sel[0]),
    mux(mux(a[3], b[3], sel[1]), mux(c[3], d[3], sel[1]), sel[0]),
    mux(mux(a[4], b[4], sel[1]), mux(c[4], d[4], sel[1]), sel[0]),
    mux(mux(a[5], b[5], sel[1]), mux(c[5], d[5], sel[1]), sel[0]),
    mux(mux(a[6], b[6], sel[1]), mux(c[6], d[6], sel[1]), sel[0]),
    mux(mux(a[7], b[7], sel[1]), mux(c[7], d[7], sel[1]), sel[0]),
    mux(mux(a[8], b[8], sel[1]), mux(c[8], d[8], sel[1]), sel[0]),
    mux(mux(a[9], b[9], sel[1]), mux(c[9], d[9], sel[1]), sel[0]),
    mux(mux(a[10], b[10], sel[1]), mux(c[10], d[10], sel[1]), sel[0]),
    mux(mux(a[11], b[11], sel[1]), mux(c[11], d[11], sel[1]), sel[0]),
    mux(mux(a[12], b[12], sel[1]), mux(c[12], d[12], sel[1]), sel[0]),
    mux(mux(a[13], b[13], sel[1]), mux(c[13], d[13], sel[1]), sel[0]),
    mux(mux(a[14], b[14], sel[1]), mux(c[14], d[14], sel[1]), sel[0]),
    mux(mux(a[15], b[15], sel[1]), mux(c[15], d[15], sel[1]), sel[0]),
  ];
}
mux4way16.gateCounts = {};
