import { dmux } from '@/gates/basic/dmux';

import runLogicTests from '../../runLogicTests';

runLogicTests('DMUX', dmux, [
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
