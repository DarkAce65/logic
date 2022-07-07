import { or8way } from '@/gates/multiplexer/or8way';
import { Bool, Tuple } from '@/types';

import { runSingleOutputMultibitLogicTests, toBinaryTuple } from '../../runLogicTests';

runSingleOutputMultibitLogicTests(
  'OR8Way',
  or8way
)(
  new Array(Math.pow(2, 8)).fill(0).map((_, index) => {
    const input: [Tuple<Bool, 8>] = [toBinaryTuple(index, 8)];
    const expected = input[0].some((b) => b === 1) ? 1 : 0;

    return [input, expected];
  })
);
