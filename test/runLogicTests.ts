import { expect, test } from 'vitest';

import type { Bool, WithGateCounts } from '@/gates';

const toBinaryString = (num: number, length: number): string =>
  (new Array(length).fill('0').join('') + num.toString(2)).slice(-length);

function runLogicTests<T extends Bool[]>(
  logicGateName: string,
  gateFunction: WithGateCounts<T>,
  truthTable: [T, Bool][]
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
    test(`${logicGateName}(${inputs.join(', ')}) === ${expected}`, () => {
      expect(gateFunction(...inputs)).toBe(expected);
    });
  }
}

export default runLogicTests;
