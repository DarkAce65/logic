import { or16 } from '@/gates/multibit/or16';
import { Bool, Tuple } from '@/types';

import { runSingleOutputMultibitLogicTests, toBinaryTuple } from '../../runLogicTests';

runSingleOutputMultibitLogicTests(
  'OR16',
  or16
)(
  [
    [0, 0],
    [0, Math.pow(2, 16) - 1],
    [Math.pow(2, 16) - 1, 0],
    [Math.pow(2, 16) - 1, Math.pow(2, 16) - 1],
    ...new Array(100).fill(false),
  ].map((value: [number, number] | false) => {
    const i: [number, number] =
      value === false
        ? [Math.floor(Math.random() * Math.pow(2, 16)), Math.floor(Math.random() * Math.pow(2, 16))]
        : value;

    const input: [Tuple<Bool, 16>, Tuple<Bool, 16>] = [
      toBinaryTuple(i[0], 16),
      toBinaryTuple(i[1], 16),
    ];
    const expected = toBinaryTuple(0, 16).map((_, index) =>
      input[0][index] === 1 || input[1][index] === 1 ? 1 : 0
    ) as Tuple<Bool, 16>;

    return [input, expected];
  })
);
