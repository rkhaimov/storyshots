import { PropertyAssignment, SourceFile } from 'typescript';
import { EndpointParsingResult, ServiceParsingResult } from './types';
import { createAST } from './internal/createAST';
import { createEndpointsAssignments } from './internal/createEndpointsAssignments';
import { createEndpointFactoryExpression } from './internal/createEndpointFactoryExpression';
import { createInputTypeName } from './createInputTypeName';
import { createOutputTypeName } from './createOutputTypeName';
import { createName } from './createName';
import { createURL } from './createURL';
import { createMethod } from './createMethod';
import { createArgs } from './createArgs';

export function parse(code: string): ServiceParsingResult {
  const ast = createAST(code);

  return createServiceParsingResult(ast);
}

function createServiceParsingResult(ast: SourceFile): ServiceParsingResult {
  const endpoints = createEndpointsAssignments(ast);

  return endpoints.map(createEndpointParsingResult);
}

function createEndpointParsingResult(
  endpoint: PropertyAssignment,
): EndpointParsingResult {
  const factory = createEndpointFactoryExpression(endpoint);

  return {
    name: createName(endpoint),
    url: createURL(factory),
    method: createMethod(factory),
    args: createArgs(factory),
    input: createInputTypeName(factory),
    output: createOutputTypeName(factory),
  };
}
