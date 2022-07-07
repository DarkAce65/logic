import type { Bool, Tuple } from '@/types';

import { or } from '../basic/or';

export function or8way(a: Tuple<Bool, 8>): Bool {
  return or(a[0], or(a[1], or(a[2], or(a[3], or(a[4], or(a[5], or(a[6], a[7])))))));
}
or8way.gateCounts = {};
