import ts, { Node, PropertyAssignment, SourceFile } from 'typescript';
import assert from 'assert';
import { narrow } from './narrow';

export function createEndpointsAssignments(
  ast: SourceFile,
): PropertyAssignment[] {
  const assignment = ast.forEachChild(findAssignment);

  assert(assignment);

  return narrow(assignment.initializer)
    .ensure(ts.isArrowFunction, (it) => it.body)
    .ensure(ts.isParenthesizedExpression, (it) => it.expression)
    .ensure(ts.isObjectLiteralExpression, (it) => it)
    .fold()
    .properties.map((it) =>
      narrow(it)
        .ensure(ts.isPropertyAssignment, (it) => it)
        .fold(),
    );

  function findAssignment(node: Node): ts.PropertyAssignment | undefined {
    if (
      ts.isPropertyAssignment(node) &&
      ts.isIdentifier(node.name) &&
      node.name.text === 'endpoints'
    ) {
      return node;
    }

    return node.forEachChild(findAssignment);
  }
}
