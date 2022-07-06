import { not16 } from '@/gates/multibit/not16';
import type { Bool, Tuple } from '@/types';

import { runSingleOutputMultibitLogicTests, toBinaryTuple } from '../../runLogicTests';

runSingleOutputMultibitLogicTests(
  'NOT16',
  not16
)(
  [0, Math.pow(2, 16) - 1, ...new Array(100).fill(false)].map((value: number | false) => {
    const i: number = value === false ? Math.floor(Math.random() * Math.pow(2, 16)) : value;

    const input = toBinaryTuple(i, 16);
    const expected = input.map((b) => (b === 1 ? 0 : 1)) as Tuple<Bool, 16>;

    return [[input], expected];
  })
);
