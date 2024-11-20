import { CallExpression } from 'typescript';
import assert from 'assert';
import { parseTypeName } from './internal/parseTypeName';

export function createInputTypeName(factory: CallExpression) {
  const args = factory.typeArguments;

  assert(args);

  return parseTypeName(args[1]);
}
