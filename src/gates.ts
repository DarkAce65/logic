import { and } from './basic/and';
import { nand } from './basic/nand';
import { not } from './basic/not';
import { or } from './basic/or';
import { xor } from './basic/xor';

export type Bool = 0 | 1;
interface GateFunction<T extends Bool[]> {
  (...args: T): Bool;
}
export interface WithGateCounts<T extends Bool[] = Bool[]> extends GateFunction<T> {
  gateCounts: { [gate: string]: number };
}

export const ALL_GATES: {
  [gateOrCategory: string]: WithGateCounts | { [gate: string]: WithGateCounts };
} = { nand, basic: { and, not, or, xor } };
export const FLATTENED_GATES = Object.keys(ALL_GATES).reduce<{ [gate: string]: WithGateCounts }>(
  (flattenedGates, gateOrCategory) => {
    const gateData = ALL_GATES[gateOrCategory];
    return typeof gateData === 'function'
      ? { ...flattenedGates, [gateOrCategory]: gateData }
      : {
          ...flattenedGates,
          ...Object.keys(gateData).reduce((acc, gate) => ({ ...acc, [gate]: gateData[gate] }), {}),
        };
  },
  {}
);
