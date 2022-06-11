import runLogicTests from '../runLogicTests';

import { and } from '@/basic/and';

runLogicTests('AND', and, [
  [[0, 0], 0],
  [[0, 1], 0],
  [[1, 0], 0],
  [[1, 1], 1],
]);
