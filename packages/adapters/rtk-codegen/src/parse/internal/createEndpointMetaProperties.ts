import ts from 'typescript';
import assert from 'assert';
import { narrow } from './narrow';

export function createEndpointMetaProperties(
  call: ts.CallExpression,
): ts.PropertyAssignment[] {
  assert(call.arguments.length === 1);

  const assignment = narrow(call.arguments[0])
    .ensure(ts.isObjectLiteralExpression, (it) => it.properties[0])
    .ensure(ts.isPropertyAssignment, (it) => it)
    .fold();

  const query = narrow(assignment.name)
    .ensure(ts.isIdentifier, (it) => it.text)
    .fold();

  assert(query === 'query');

  return narrow(assignment.initializer)
    .ensure(ts.isArrowFunction, (it) => it.body)
    .ensure(ts.isParenthesizedExpression, (it) => it.expression)
    .ensure(ts.isObjectLiteralExpression, (it) => it.properties)
    .fold()
    .map((property) =>
      narrow(property)
        .ensure(ts.isPropertyAssignment, (it) => it)
        .fold(),
    );
}
