import type { Bool } from '../main';

export function nand(a: Bool, b: Bool): Bool {
  return a === 1 && b === 1 ? 0 : 1;
}
nand.gateCounts = {};
