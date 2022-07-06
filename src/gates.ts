import type { WithGateCounts } from './types';

import { and } from './gates/basic/and';
import { dmux } from './gates/basic/dmux';
import { mux } from './gates/basic/mux';
import { not } from './gates/basic/not';
import { or } from './gates/basic/or';
import { xor } from './gates/basic/xor';
import { and16 } from './gates/multibit/and16';
import { not16 } from './gates/multibit/not16';
import { nand } from './gates/nand';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type WithGateCountsIgnoringArgs = WithGateCounts<any[], any>;

export const ALL_GATES: {
  [gateOrCategory: string]:
    | WithGateCountsIgnoringArgs
    | { [gate: string]: WithGateCountsIgnoringArgs };
} = {
  nand,
  basic: { and, dmux, mux, not, or, xor },
  multibit: { not16, and16 },
};

export const FLATTENED_GATES = Object.keys(ALL_GATES).reduce<{
  [gate: string]: WithGateCountsIgnoringArgs;
}>((flattenedGates, gateOrCategory) => {
  const gateData = ALL_GATES[gateOrCategory];
  return typeof gateData === 'function'
    ? { ...flattenedGates, [gateOrCategory]: gateData }
    : {
        ...flattenedGates,
        ...Object.keys(gateData).reduce((acc, gate) => ({ ...acc, [gate]: gateData[gate] }), {}),
      };
}, {});
