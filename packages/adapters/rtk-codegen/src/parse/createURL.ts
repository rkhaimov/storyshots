import ts from 'typescript';
import assert from 'assert';
import { narrow } from './internal/narrow';
import { EndpointParsingResult } from './types';
import { createEndpointMetaProperties } from './internal/createEndpointMetaProperties';

export function createURL(
  call: ts.CallExpression,
): EndpointParsingResult['url'] {
  const params = createEndpointMetaProperties(call);

  const url = params.find((property) => property.name.getText() === 'url');

  assert(url);

  const template = narrow(url.initializer)
    .ensure(ts.isTemplateLiteral, (it) => it.getText())
    .fold();

  return template.replace(/`/g, '').replace('${queryArg}', ':arg');
}
