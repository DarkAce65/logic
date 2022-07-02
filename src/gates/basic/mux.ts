import type { Bool } from '@/types';

import { and } from './and';
import { not } from './not';
import { or } from './or';

export function mux(a: Bool, b: Bool, sel: Bool): Bool {
  return or(and(a, not(sel)), and(b, sel));
}
mux.gateCounts = {};
