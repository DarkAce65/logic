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
  const callCounts = {};

  return {
    name: 'call-count',
    transform(code, id) {
      if (id.includes('node_modules')) {
        return;
      }

      const source = createSourceFile(id, code, ScriptTarget.ESNext);
      source.forEachChild((sourceNode) => {
        if (isFunctionDeclaration(sourceNode)) {
          callCounts[sourceNode.name.text] = {};
          for (const callExpression of findCallExpressions(sourceNode, source)) {
            const functionName = callExpression.expression.getText(source);
            if (!callCounts[sourceNode.name.text][functionName]) {
              callCounts[sourceNode.name.text][functionName] = 0;
            }
            callCounts[sourceNode.name.text][functionName] += 1;
          }
        }
      });

      console.log(callCounts);
    },
  };
}

export default callCountPlugin;
