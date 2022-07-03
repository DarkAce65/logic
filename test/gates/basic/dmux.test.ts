import { dmux } from '@/gates/basic/dmux';

import { runExhaustiveLogicTests } from '../../runLogicTests';

runExhaustiveLogicTests(
  'DMUX',
  dmux
)([
  [
    [0, 0],
    [0, 0],
  ],
  [
    [0, 1],
    [0, 0],
  ],
  [
    [1, 0],
    [1, 0],
  ],
  [
    [1, 1],
    [0, 1],
  ],
]);
