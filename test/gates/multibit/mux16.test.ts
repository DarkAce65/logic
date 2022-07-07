import { mux16 } from '@/gates/multibit/mux16';
import { Bool, Tuple } from '@/types';

import { runSingleOutputMultibitLogicTests, toBinaryTuple } from '../../runLogicTests';

runSingleOutputMultibitLogicTests(
  'MUX16',
  mux16
)(
  [
    [0, 0, 0],
    [0, Math.pow(2, 16) - 1, 0],
    [0, Math.pow(2, 16) - 1, 1],
    [Math.pow(2, 16) - 1, 0, 0],
    [Math.pow(2, 16) - 1, 0, 1],
    [Math.pow(2, 16) - 1, Math.pow(2, 16) - 1, 0],
    [Math.pow(2, 16) - 1, Math.pow(2, 16) - 1, 1],
    ...new Array(100).fill(false),
  ].map((value: [number, number, Bool] | false) => {
    const i: [number, number, Bool] =
      value === false
        ? [
            Math.floor(Math.random() * Math.pow(2, 16)),
            Math.floor(Math.random() * Math.pow(2, 16)),
            Math.random() > 0.5 ? 1 : 0,
          ]
        : value;

    const input: [Tuple<Bool, 16>, Tuple<Bool, 16>, Bool] = [
      toBinaryTuple(i[0], 16),
      toBinaryTuple(i[1], 16),
      i[2],
    ];
    const expected = input[2] === 0 ? input[0] : input[1];

    return [input, expected];
  })
);
