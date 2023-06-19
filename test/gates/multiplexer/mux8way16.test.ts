import { mux8way16 } from '@/gates/multiplexer/mux8way16';
import { Bool, Tuple } from '@/types';

import { runSingleOutputMultibitLogicTests, toBinaryTuple } from '../../runLogicTests';

runSingleOutputMultibitLogicTests(
  'MUX8Way16',
  mux8way16
)(
  [
    [0, 0, 0, 0, 0],
    [0, 0, 0, 0, 1],
    [0, 0, 0, 0, 2],
    [0, 0, 0, 0, 3],
    [Math.pow(2, 16) - 1, Math.pow(2, 16) - 1, Math.pow(2, 16) - 1, Math.pow(2, 16) - 1, 0],
    [Math.pow(2, 16) - 1, Math.pow(2, 16) - 1, Math.pow(2, 16) - 1, Math.pow(2, 16) - 1, 1],
    [Math.pow(2, 16) - 1, Math.pow(2, 16) - 1, Math.pow(2, 16) - 1, Math.pow(2, 16) - 1, 2],
    [Math.pow(2, 16) - 1, Math.pow(2, 16) - 1, Math.pow(2, 16) - 1, Math.pow(2, 16) - 1, 3],
    ...new Array(100).fill(false),
  ].map((value: [number, number, number, number, number] | false) => {
    const i: [number, number, number, number, number] =
      value === false
        ? [
            Math.floor(Math.random() * Math.pow(2, 16)),
            Math.floor(Math.random() * Math.pow(2, 16)),
            Math.floor(Math.random() * Math.pow(2, 16)),
            Math.floor(Math.random() * Math.pow(2, 16)),
            Math.floor(Math.random() * 4),
          ]
        : value;

    const input: [
      Tuple<Bool, 16>,
      Tuple<Bool, 16>,
      Tuple<Bool, 16>,
      Tuple<Bool, 16>,
      Tuple<Bool, 2>
    ] = [
      toBinaryTuple(i[0], 16),
      toBinaryTuple(i[1], 16),
      toBinaryTuple(i[2], 16),
      toBinaryTuple(i[3], 16),
      toBinaryTuple(i[4], 2),
    ];
    let expected = toBinaryTuple(0, 16);
    if (input[4][0] === 0 && input[4][1] === 0) {
      expected = input[0];
    } else if (input[4][0] === 0 && input[4][1] === 1) {
      expected = input[1];
    } else if (input[4][0] === 1 && input[4][1] === 0) {
      expected = input[2];
    } else if (input[4][0] === 1 && input[4][1] === 1) {
      expected = input[3];
    }

    return [input, expected];
  })
);
