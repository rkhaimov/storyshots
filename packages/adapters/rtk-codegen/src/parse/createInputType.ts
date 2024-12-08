import assert from 'assert';
import { CallExpression } from 'typescript';
import { InputTypeAsValue } from '../types';
import { parseTypeName } from './internal/parseTypeName';

export function createInputType(factory: CallExpression): InputTypeAsValue {
  const args = factory.typeArguments;

  assert(args);

  const name = args[1];

  return {
    name: parseTypeName(name),
    type: 'void',
  };
}
