import runLogicTests from '../runLogicTests';

import { xor } from '@/basic/xor';

runLogicTests('XOR', xor, [
  [[0, 0], 0],
  [[0, 1], 1],
  [[1, 0], 1],
  [[1, 1], 0],
]);
