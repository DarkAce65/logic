import { Bool } from './main';

export function nand(a: Bool, b: Bool) {
  return a === 1 && b === 1 ? 0 : 1;
}