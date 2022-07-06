import type { Bool, Tuple } from '@/types';

import { and } from '../basic/and';

export function and16(a: Tuple<Bool, 16>, b: Tuple<Bool, 16>): Tuple<Bool, 16> {
  return [
    and(a[0], b[0]),
    and(a[1], b[1]),
    and(a[2], b[2]),
    and(a[3], b[3]),
    and(a[4], b[4]),
    and(a[5], b[5]),
    and(a[6], b[6]),
    and(a[7], b[7]),
    and(a[8], b[8]),
    and(a[9], b[9]),
    and(a[10], b[10]),
    and(a[11], b[11]),
    and(a[12], b[12]),
    and(a[13], b[13]),
    and(a[14], b[14]),
    and(a[15], b[15]),
  ];
}
and16.gateCounts = {};
