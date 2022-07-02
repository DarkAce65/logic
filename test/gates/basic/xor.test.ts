import { xor } from '@/gates/basic/xor';

import runLogicTests from '../../runLogicTests';

runLogicTests('XOR', xor, [
  [[0, 0], 0],
  [[0, 1], 1],
  [[1, 0], 1],
  [[1, 1], 0],
]);
