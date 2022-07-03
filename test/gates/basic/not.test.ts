import { not } from '@/gates/basic/not';

import { runExhaustiveLogicTests } from '../../runLogicTests';

runExhaustiveLogicTests(
  'NOT',
  not
)([
  [[0], 1],
  [[1], 0],
]);
