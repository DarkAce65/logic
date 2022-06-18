import { and } from './basic/and';
import { nand } from './basic/nand';
import { not } from './basic/not';
import { or } from './basic/or';
import { xor } from './basic/xor';

export type Bool = 0 | 1;
export interface WithGateCounts {
  gateCounts: { [gate: string]: number };
}

const ALL_GATES: { [gate: string]: WithGateCounts } = { and, nand, not, or, xor };

console.log(
  Object.keys(ALL_GATES).reduce((acc, gate) => ({ ...acc, [gate]: ALL_GATES[gate].gateCounts }), {})
);
