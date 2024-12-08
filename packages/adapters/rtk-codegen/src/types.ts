import { generateEndpoints } from '@rtk-query/codegen-openapi';
import type { DefaultBodyType, HttpResponse, StrictRequest } from 'msw';
import { http } from 'msw';

export type Settings = Omit<
  Parameters<typeof generateEndpoints>[0],
  'flattenArg'
> & {
  outputFile: string;
};

export type ServiceParsingResult = EndpointParsingResult[];

export type EndpointParsingResult = {
  name: string;
  url: string;
  method: 'get' | 'post' | 'put' | 'delete';
  input: InputTypeAsValue;
  output: string;
};

export type EndpointHandlerMeta = {
  url: string;
  method: 'get' | 'post' | 'put' | 'delete';
  arg: TypeAsValue;
  body?: string;
  handler(input: never): unknown;
};

export type InputTypeAsValue = {
  type: TypeAsValue;
  name: string;
  body?: string;
};

export type TypeAsValue = 'void' | Record<string, TypeKind>;

export type TypeKind = 'any' | 'string' | 'number' | 'boolean' | 'struct';

export type RequestHandlerInfo = {
  params: Record<string, string | readonly string[]>;
  cookies: Record<string, string>;
  request: StrictRequest<DefaultBodyType>;
};

export interface RequestHandlerMeta {
  path: string;
  method: keyof typeof http;
  handler: (info: RequestHandlerInfo) => Promise<HttpResponse>;
}
