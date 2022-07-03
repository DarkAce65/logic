import { or } from '@/gates/basic/or';

import { runExhaustiveLogicTests } from '../../runLogicTests';

runExhaustiveLogicTests(
  'OR',
  or
)([
  [[0, 0], 0],
  [[0, 1], 1],
  [[1, 0], 1],
  [[1, 1], 1],
]);
