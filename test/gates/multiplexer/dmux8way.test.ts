import { dmux8way } from '@/gates/multiplexer/dmux8way';
import { Bool, Tuple } from '@/types';

import { runMultiOutputMultibitLogicTests, toBinaryTuple } from '../../runLogicTests';

runMultiOutputMultibitLogicTests(
  'DMUX8Way',
  dmux8way
)([
  ...new Array(Math.pow(2, 3)).fill(false).map((_, index) => {
    const input = 0;

    const inputs: [Bool, Tuple<Bool, 3>] = [input, toBinaryTuple(index, 3)];
    const expected: Tuple<Bool, 8> = [0, 0, 0, 0, 0, 0, 0, 0];

    return [inputs, expected] as [typeof inputs, typeof expected];
  }),
  ...new Array(Math.pow(2, 3)).fill(false).map((_, index) => {
    const input = 1;

    const inputs: [Bool, Tuple<Bool, 3>] = [input, toBinaryTuple(index, 3)];
    const expected: Tuple<Bool, 8> = [0, 0, 0, 0, 0, 0, 0, 0];
    expected[index] = input;

    return [inputs, expected] as [typeof inputs, typeof expected];
  }),
]);
