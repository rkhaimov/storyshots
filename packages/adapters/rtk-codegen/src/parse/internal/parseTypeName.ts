import ts from 'typescript';
import { narrow } from './narrow';

export function parseTypeName(ref: ts.TypeNode): string {
  return narrow(ref)
    .ensure(ts.isTypeReferenceNode, (it) => it.typeName)
    .ensure(ts.isIdentifier, (it) => it.text)
    .fold();
}
