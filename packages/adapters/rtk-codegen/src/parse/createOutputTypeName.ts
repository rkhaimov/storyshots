import { CallExpression } from 'typescript';
import assert from 'assert';
import { parseTypeName } from './internal/parseTypeName';

export function createOutputTypeName(factory: CallExpression) {
  const args = factory.typeArguments;

  assert(args);

  return parseTypeName(args[0]);
}
