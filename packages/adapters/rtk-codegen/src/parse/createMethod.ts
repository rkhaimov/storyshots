import ts from 'typescript';
import { EndpointParsingResult } from './types';
import { narrow } from './internal/narrow';
import { createEndpointMetaProperties } from './internal/createEndpointMetaProperties';

export function createMethod(
  call: ts.CallExpression,
): EndpointParsingResult['method'] {
  const properties = createEndpointMetaProperties(call);
  const method = properties.find(
    (property) => property.name.getText() === 'method',
  );

  if (method === undefined) {
    return 'GET';
  }

  return narrow(method.initializer)
    .ensure(ts.isStringLiteral, (it) => it.text)
    .fold();
}
