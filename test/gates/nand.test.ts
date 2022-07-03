import { nand } from '@/gates/nand';

import { runExhaustiveLogicTests } from '../runLogicTests';

runExhaustiveLogicTests(
  'NAND',
  nand
)([
  [[0, 0], 1],
  [[0, 1], 1],
  [[1, 0], 1],
  [[1, 1], 0],
]);
