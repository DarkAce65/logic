import { and } from '@/gates/basic/and';

import runLogicTests from '../../runLogicTests';

runLogicTests('AND', and, [
  [[0, 0], 0],
  [[0, 1], 0],
  [[1, 0], 0],
  [[1, 1], 1],
]);
