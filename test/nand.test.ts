import { nand } from '../src/nand';

import runLogicTests from './runLogicTests';

runLogicTests('NAND', nand, [
  [[0, 0], 1],
  [[0, 1], 1],
  [[1, 0], 1],
  [[1, 1], 0],
]);
