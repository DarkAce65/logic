import { or } from '@/gates/basic/or';

import runLogicTests from '../../runLogicTests';

runLogicTests('OR', or, [
  [[0, 0], 0],
  [[0, 1], 1],
  [[1, 0], 1],
  [[1, 1], 1],
]);
