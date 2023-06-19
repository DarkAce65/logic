import { Bool, Tuple } from '@/types';

import { dmux } from '../basic/dmux';

export function dmux8way(input: Bool, sel: Tuple<Bool, 3>): Tuple<Bool, 8> {
  const [pow2High, pow2Low] = dmux(input, sel[0]);

  const [pow2High_pow1High, pow2High_pow1Low] = dmux(pow2High, sel[1]);
  const [pow2Low_pow1High, pow2Low_pow1Low] = dmux(pow2Low, sel[1]);

  const [pow2High_pow1High_pow0High, pow2High_pow1High_pow0Low] = dmux(pow2High_pow1High, sel[2]);
  const [pow2High_pow1Low_pow0High, pow2High_pow1Low_pow0Low] = dmux(pow2High_pow1Low, sel[2]);
  const [pow2Low_pow1High_pow0High, pow2Low_pow1High_pow0Low] = dmux(pow2Low_pow1High, sel[2]);
  const [pow2Low_pow1Low_pow0High, pow2Low_pow1Low_pow0Low] = dmux(pow2Low_pow1Low, sel[2]);

  return [
    pow2High_pow1High_pow0High,
    pow2High_pow1High_pow0Low,
    pow2High_pow1Low_pow0High,
    pow2High_pow1Low_pow0Low,
    pow2Low_pow1High_pow0High,
    pow2Low_pow1High_pow0Low,
    pow2Low_pow1Low_pow0High,
    pow2Low_pow1Low_pow0Low,
  ];
}
dmux8way.gateCounts = {};
