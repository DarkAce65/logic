import { expect, test } from 'vitest';

import type { Bool, WithGateCounts } from '@/types';

const toBinaryString = (num: number, length: number): string =>
  (new Array(length).fill('0').join('') + num.toString(2)).slice(-length);

function runLogicTests<I extends Bool[], O extends Bool | Bool[]>(
  logicGateName: string,
  gateFunction: WithGateCounts<I, O>,
  truthTable: [I, O][]
) {
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

  for (const [inputs, expected] of truthTable.sort(([a], [b]) =>
    a.join('').localeCompare(b.join(''))
  )) {
    const inputsString = inputs.join(', ');
    const expectedString = Array.isArray(expected) ? `[${expected.join(', ')}]` : expected;
    test(`${logicGateName}(${inputsString}) === ${expectedString}`, () => {
      expect(gateFunction(...inputs)).toStrictEqual(expected);
    });
  }
}

export default runLogicTests;
