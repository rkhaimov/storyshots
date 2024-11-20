import ts, {
  Node,
  SourceFile,
  SyntaxKind,
  TypeAliasDeclaration,
} from 'typescript';
import { EndpointParsingResult, PathArg } from './types';
import { createEndpointMetaProperties } from './internal/createEndpointMetaProperties';
import assert from 'assert';
import { createInputTypeName } from './createInputTypeName';

export function createArgs(
  call: ts.CallExpression,
): EndpointParsingResult['args'] {
  return createPathArgs(call);
}

function createPathArgs(factory: ts.CallExpression): PathArg[] {
  const params = createEndpointMetaProperties(factory);

  const url = params.find((property) => property.name.getText() === 'url');

  assert(url);

  const template = url.initializer;

  if (!ts.isTemplateExpression(template)) {
    return [];
  }

  return template.templateSpans.map((span) => ({
    from: 'path',
    name: span.getText(),
    type: getTypeOfExpression(span.expression, factory),
  }));
}

function getTypeOfExpression(
  expression: ts.Expression,
  factory: ts.CallExpression,
): string {
  const input = createInputTypeName(factory);

  const declaration = findTypeAliasDeclarationByName(
    input,
    factory.getSourceFile(),
  );

  return mapTypeToString(declaration.type);
}

function findTypeAliasDeclarationByName(
  name: string,
  source: SourceFile,
): TypeAliasDeclaration {
  const declaration = source.forEachChild(findDeclaration);

  assert(declaration);

  return declaration;

  function findDeclaration(node: Node): ts.TypeAliasDeclaration | undefined {
    if (
      ts.isTypeAliasDeclaration(node) &&
      ts.isIdentifier(node.name) &&
      node.name.text === name
    ) {
      return node;
    }

    return node.forEachChild(findDeclaration);
  }
}

function mapTypeToString(node: ts.TypeNode): string {
  if (node.kind === SyntaxKind.NumberKeyword) {
    return 'number';
  }

  return 'unknown';
}
