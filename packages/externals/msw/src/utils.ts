import { HttpResponse } from 'msw';
import { EndpointArgs } from './types';

export function params(args: EndpointArgs) {
  return args.params as never;
}

export function query(args: EndpointArgs) {
  return Object.fromEntries(
    new URL(args.request.url).searchParams.entries(),
  ) as never;
}

export async function body(args: EndpointArgs) {
  return (await args.request.clone().json()) as never;
}

export const native = (response: HttpResponse): never => {
  throw response;
};
