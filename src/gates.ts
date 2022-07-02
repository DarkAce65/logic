import { and } from './gates/basic/and';
import { not } from './gates/basic/not';
import { or } from './gates/basic/or';
import { xor } from './gates/basic/xor';
import { nand } from './gates/nand';

export type Bool = 0 | 1;
interface GateFunction<I extends Bool[], O extends Bool | Bool[]> {
  (...args: I): O;
}
export interface WithGateCounts<I extends Bool[] = Bool[], O extends Bool | Bool[] = Bool | Bool[]>
  extends GateFunction<I, O> {
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
