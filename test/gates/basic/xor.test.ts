import { xor } from '@/gates/basic/xor';

import { runExhaustiveLogicTests } from '../../runLogicTests';

runExhaustiveLogicTests(
  'XOR',
  xor
)([
  [[0, 0], 0],
  [[0, 1], 1],
  [[1, 0], 1],
  [[1, 1], 0],
]);
