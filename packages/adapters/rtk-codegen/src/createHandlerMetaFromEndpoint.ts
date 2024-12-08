import type { DefaultBodyType, StrictRequest } from 'msw';
import { HttpResponse } from 'msw';

import {
  EndpointHandlerMeta,
  RequestHandlerInfo,
  RequestHandlerMeta,
  TypeAsValue,
  TypeKind,
} from './types';

export function createHandlerMetaFromEndpoint(
  endpoint: EndpointHandlerMeta,
): RequestHandlerMeta {
  return {
    path: endpoint.url,
    method: endpoint.method,
    handler: async (info) => {
      const input = await createHandlerInput(info, endpoint);

      const response = await endpoint.handler(input as never);

      return HttpResponse.json(response as Record<string, unknown>);
    },
  };
}

async function createHandlerInput(
  info: RequestHandlerInfo,
  endpoint: EndpointHandlerMeta,
): Promise<Record<string, unknown> | undefined> {
  if (endpoint.arg === 'void') {
    return createVoidInput();
  }

  return {
    ...parsePaths(info.params, endpoint.arg),
    ...parseQueries(info.request, endpoint.arg),
    ...(await parseBody(info.request, endpoint.body)),
  };
}

function parsePaths(
  params: Record<string, string>,
  type: Exclude<TypeAsValue, 'void'>,
): Record<string, unknown> {
  const entries = Object.entries(params).map(
    ([key, value]) => [key, format(value, type[key])] as const,
  );

  return Object.fromEntries(entries);
}

function parseQueries(
  request: StrictRequest<DefaultBodyType>,
  type: Exclude<TypeAsValue, 'void'>,
): Record<string, unknown> {
  const entries = Array.from(new URL(request.url).searchParams.entries()).map(
    ([key, value]) => [key, format(value, type[key])] as const,
  );

  return Object.fromEntries(entries);
}

async function parseBody(
  request: StrictRequest<DefaultBodyType>,
  name: string | undefined,
): Promise<Record<string, unknown>> {
  if (name === undefined || request.body === null) {
    return {};
  }

  return { [name]: await request.json() };
}

function createVoidInput() {
  return undefined;
}

function format(value: string, kind: TypeKind): string | number | boolean {
  switch (kind) {
    case 'any':
    case 'struct':
    case 'string':
      return value;
    case 'number':
      return parseInt(value);
    case 'boolean':
      return value === 'true';
  }
}
