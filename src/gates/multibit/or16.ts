import type { Bool, Tuple } from '@/types';

import { or } from '../basic/or';

export function or16(a: Tuple<Bool, 16>, b: Tuple<Bool, 16>): Tuple<Bool, 16> {
  return [
    or(a[0], b[0]),
    or(a[1], b[1]),
    or(a[2], b[2]),
    or(a[3], b[3]),
    or(a[4], b[4]),
    or(a[5], b[5]),
    or(a[6], b[6]),
    or(a[7], b[7]),
    or(a[8], b[8]),
    or(a[9], b[9]),
    or(a[10], b[10]),
    or(a[11], b[11]),
    or(a[12], b[12]),
    or(a[13], b[13]),
    or(a[14], b[14]),
    or(a[15], b[15]),
  ];
}
or16.gateCounts = {};
