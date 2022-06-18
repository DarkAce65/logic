import * as path from 'path';

import type { Plugin } from 'vite';

import {
  CallExpression,
  Node,
  ScriptTarget,
  SourceFile,
  createSourceFile,
  isCallExpression,
  isFunctionDeclaration,
} from 'typescript';

const findCallExpressions = (node: Node, source: SourceFile): CallExpression[] => {
  const expressions = [];

  if (isCallExpression(node)) {
    expressions.push(node);
  }
  for (const child of node.getChildren(source)) {
    expressions.push(...findCallExpressions(child, source));
  }

  return expressions;
};

function callCountPlugin(): Plugin {
  const srcDir = path.join(__dirname, '../src');
  const callCounts = {};

  return {
    name: 'call-counts',
    transform(contents, id) {
      const relative = path.relative(srcDir, id);
      if (!relative || relative.startsWith('..') || path.isAbsolute(relative)) {
        return;
      }

      let newContents: string;

      const source = createSourceFile(id, contents, ScriptTarget.ESNext);
      source.forEachChild((sourceNode) => {
        if (isFunctionDeclaration(sourceNode)) {
          const functionName = sourceNode.name.text;
          const callsInjectionPoint = `${functionName}.gateCounts = {};`;
          if (!contents.includes(callsInjectionPoint)) {
            return;
          }

          callCounts[functionName] = {};
          for (const callExpression of findCallExpressions(sourceNode, source)) {
            const callName = callExpression.expression.getText(source);
            if (!callCounts[functionName][callName]) {
              callCounts[functionName][callName] = 0;
            }
            callCounts[functionName][callName] += 1;
          }
          newContents = (newContents || contents).replace(
            callsInjectionPoint,
            `${functionName}.gateCounts = ${JSON.stringify(callCounts[functionName])};`
          );
        }
      });

      if (newContents !== undefined) {
        return { code: newContents };
      }
    },
  };
}

export default callCountPlugin;
