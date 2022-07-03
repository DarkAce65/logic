import { mux } from '@/gates/basic/mux';

import { runExhaustiveLogicTests } from '../../runLogicTests';

runExhaustiveLogicTests(
  'MUX',
  mux
)([
  [[0, 0, 0], 0],
  [[0, 0, 1], 0],
  [[0, 1, 0], 0],
  [[0, 1, 1], 1],
  [[1, 0, 0], 1],
  [[1, 0, 1], 0],
  [[1, 1, 0], 1],
  [[1, 1, 1], 1],
]);
