import { not } from '@/gates/basic/not';

import runLogicTests from '../../runLogicTests';

runLogicTests('NOT', not, [
  [[0], 1],
  [[1], 0],
]);
