import { Bool, Tuple } from '@/types';

import { dmux } from '../basic/dmux';

export function dmux4way(input: Bool, sel: Tuple<Bool, 2>): Tuple<Bool, 4> {
  const [pow1High, pow1Low] = dmux(input, sel[0]);

  const [pow1High_pow0High, pow1High_pow0Low] = dmux(pow1High, sel[1]);
  const [pow1Low_pow0High, pow1Low_pow0Low] = dmux(pow1Low, sel[1]);

  return [pow1High_pow0High, pow1High_pow0Low, pow1Low_pow0High, pow1Low_pow0Low];
}
dmux4way.gateCounts = {};
