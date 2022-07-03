import { and } from '@/gates/basic/and';

import { runExhaustiveLogicTests } from '../../runLogicTests';

runExhaustiveLogicTests(
  'AND',
  and
)([
  [[0, 0], 0],
  [[0, 1], 0],
  [[1, 0], 0],
  [[1, 1], 1],
]);
