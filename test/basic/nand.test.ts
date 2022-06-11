import runLogicTests from '../runLogicTests';

import { nand } from '@/basic/nand';

runLogicTests('NAND', nand, [
  [[0, 0], 1],
  [[0, 1], 1],
  [[1, 0], 1],
  [[1, 1], 0],
]);
