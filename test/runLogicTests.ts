import { expect, test } from 'vitest';

import type { Bool, Tuple, WithGateCounts } from '@/types';

const fromBinaryString = (binary: string): number => parseInt(binary, 2);
const toBinaryString = (num: number, length: number): string => {
  const binary = num.toString(2);
  return `${new Array(length - binary.length).fill('0').join('')}${binary}`;
};

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
        .map((input) =>
          Array.isArray(input) ? `${fromBinaryString(input.join(''))}_${input.length}` : input
        )
        .join(', ');
      const expectedString = Array.isArray(expected)
        ? `${fromBinaryString(expected.join(''))}_${expected.length}`
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
          .map((input) => (Array.isArray(input) ? fromBinaryString(input.join('')) : input))
          .join(', '),
        i,
        e,
      ])
      .sort(([a], [b]) => a.localeCompare(b));
    for (const [inputsString, inputs, expected] of sortedTestCases) {
      const expectedString = `[${expected
        .map((output) =>
          Array.isArray(output) ? `${fromBinaryString(output.join(''))}_${output.length}` : output
        )
        .join(', ')}]`;
      test(`${logicGateName}(${inputsString}) === ${expectedString}`, () => {
        expect(gateFunction(...inputs)).toStrictEqual(expected);
      });
    }
  };
}
