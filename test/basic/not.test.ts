import runLogicTests from '../runLogicTests';

import { not } from '@/basic/not';

runLogicTests('NOT', not, [
  [[0], 1],
  [[1], 0],
]);
