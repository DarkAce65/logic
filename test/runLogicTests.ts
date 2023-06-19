import { expect, test } from 'vitest';

import type { Bool, Tuple, WithGateCounts } from '@/types';

export const simplifyBinaryString = (binary: string): string =>
  binary.length > 2 ? `${parseInt(binary, 2)}_${binary.length}` : `${parseInt(binary, 2)}`;
export const toBinaryString = (num: number, length: number): string => {
  if (num > Math.pow(2, length) - 1) {
    throw new Error(`${num} is too large to fit in ${length} bits`);
  }

  const binary = num.toString(2);
  return `${new Array(length - binary.length).fill('0').join('')}${binary}`;
};
export const toBinaryTuple = <L extends number>(num: number, length: L): Tuple<Bool, L> =>
  toBinaryString(num, length)
    .split('')
    .map((b) => parseInt(b)) as Tuple<Bool, L>;

export function runExhaustiveLogicTests<I extends Bool[], O extends Bool | Tuple<Bool, number>>(
  logicGateName: string,
  gateFunction: WithGateCounts<I, O>
) {
  return (truthTable: [I, O][]) => {
    if (truthTable.length === 0) {
      throw new Error('Truth table cannot be empty!');
    }

    const numInputs = truthTable[0][0].length;

    test(`META: ${logicGateName} coverage`, () => {
      const cases = new Set();
      for (const [inputs] of truthTable) {
        cases.add(inputs.join(''));
      }

      const missingCases = [];
      for (let i = 0; i < Math.pow(2, numInputs); i++) {
        const inputs = toBinaryString(i, numInputs);
        if (!cases.has(inputs)) {
          missingCases.push(inputs);
        }
      }

      expect(missingCases, 'missing truth table cases').toHaveLength(0);
    });

    const sortedTruthTable = truthTable.sort(([a], [b]) => a.join('').localeCompare(b.join('')));
    for (const [inputs, expected] of sortedTruthTable) {
      const inputsString = inputs.join(', ');
      const expectedString = Array.isArray(expected) ? `[${expected.join(', ')}]` : expected;
      test(`${logicGateName}(${inputsString}) === ${expectedString}`, () => {
        expect(gateFunction(...inputs)).toStrictEqual(expected);
      });
    }
  };
}

export function runSingleOutputMultibitLogicTests<
  I extends (Bool | Tuple<Bool, number>)[],
  O extends Bool | Tuple<Bool, number>
>(logicGateName: string, gateFunction: WithGateCounts<I, O>) {
  return (testCases: [I, O][]) => {
    if (testCases.length === 0) {
      throw new Error('Test cases cannot be empty!');
    }

    const sortedTestCases = testCases.sort(([a], [b]) => a.join('').localeCompare(b.join('')));
    for (const [inputs, expected] of sortedTestCases) {
      const inputsString = inputs
        .map((input) => (Array.isArray(input) ? simplifyBinaryString(input.join('')) : input))
        .join(', ');
      const expectedString = Array.isArray(expected)
        ? simplifyBinaryString(expected.join(''))
        : expected;
      test(`${logicGateName}(${inputsString}) === ${expectedString}`, () => {
        expect(gateFunction(...inputs)).toStrictEqual(expected);
      });
    }
  };
}

export function runMultiOutputMultibitLogicTests<
  I extends (Bool | Tuple<Bool, number>)[],
  O extends Tuple<Bool | Tuple<Bool, number>, number>
>(logicGateName: string, gateFunction: WithGateCounts<I, O>) {
  return (testCases: [I, O][]) => {
    if (testCases.length === 0) {
      throw new Error('Test cases cannot be empty!');
    }

    const sortedTestCases = testCases
      .map<[string, I, O]>(([i, e]) => [
        i
          .map((input) => (Array.isArray(input) ? simplifyBinaryString(input.join('')) : input))
          .join(', '),
        i,
        e,
      ])
      .sort(([a], [b]) => a.localeCompare(b));
    for (const [inputsString, inputs, expected] of sortedTestCases) {
      const expectedString = `[${expected
        .map((output) => (Array.isArray(output) ? simplifyBinaryString(output.join('')) : output))
        .join(', ')}]`;
      test(`${logicGateName}(${inputsString}) === ${expectedString}`, () => {
        expect(gateFunction(...inputs)).toStrictEqual(expected);
      });
    }
  };
}
