import { dmux4way } from '@/gates/multiplexer/dmux4way';
import { Bool, Tuple } from '@/types';

import { runMultiOutputMultibitLogicTests, toBinaryTuple } from '../../runLogicTests';

runMultiOutputMultibitLogicTests(
  'DMUX4Way',
  dmux4way
)([
  ...new Array(Math.pow(2, 2)).fill(false).map((_, index) => {
    const input = 0;

    const inputs: [Bool, Tuple<Bool, 2>] = [input, toBinaryTuple(index, 2)];
    const expected: Tuple<Bool, 4> = [0, 0, 0, 0];

    return [inputs, expected] as [typeof inputs, typeof expected];
  }),
  ...new Array(Math.pow(2, 2)).fill(false).map((_, index) => {
    const input = 1;

    const inputs: [Bool, Tuple<Bool, 2>] = [input, toBinaryTuple(index, 2)];
    const expected: Tuple<Bool, 4> = [0, 0, 0, 0];
    expected[index] = input;

    return [inputs, expected] as [typeof inputs, typeof expected];
  }),
]);
