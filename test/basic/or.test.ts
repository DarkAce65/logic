import runLogicTests from '../runLogicTests';

import { or } from '@/basic/or';

runLogicTests('OR', or, [
  [[0, 0], 0],
  [[0, 1], 1],
  [[1, 0], 1],
  [[1, 1], 1],
]);
