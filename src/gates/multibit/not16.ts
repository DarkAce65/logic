import type { Bool, Tuple } from '@/types';

import { not } from '../basic/not';

export function not16(a: Tuple<Bool, 16>): Tuple<Bool, 16> {
  return [
    not(a[0]),
    not(a[1]),
    not(a[2]),
    not(a[3]),
    not(a[4]),
    not(a[5]),
    not(a[6]),
    not(a[7]),
    not(a[8]),
    not(a[9]),
    not(a[10]),
    not(a[11]),
    not(a[12]),
    not(a[13]),
    not(a[14]),
    not(a[15]),
  ];
}
not16.gateCounts = {};
