import { assertNotEmpty } from '@storyshots/core';
import { HttpResponse } from 'msw';
import { Arranger } from './arranger';
import { tap } from './transformers';
import {
  EndpointArgs,
  Endpoints,
  EndpointsLike,
  UnknownEndpoint,
} from './types';

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

export const endpoint =
  <TEndpoint extends keyof Endpoints>(
    name: TEndpoint,
    meta: Endpoints[TEndpoint],
  ): Arranger =>
  (externals) => ({
    ...externals,
    endpoints: {
      ...externals.endpoints,
      [name]: meta,
    },
  });

export const handle =
  <TEndpoint extends UnknownEndpoint>(
    handler: TEndpoint['handle'],
  ): Override<TEndpoint> =>
  () =>
    handler;

export const native = (response: HttpResponse): never => {
  throw response;
};

export const override =
  (overrides: Overrides): Arranger =>
  (externals) => {
    const endpoints = externals.endpoints as EndpointsLike;
    const _overrides = overrides as Record<string, Override<UnknownEndpoint>>;

    const overridden = Object.entries(_overrides).map(
      ([name, _override]): [string, UnknownEndpoint] => {
        const endpoint = endpoints[name];

        assertNotEmpty(endpoint, `${name} was not yet defined as an endpoint`);

        return [
          name,
          {
            ...endpoints[name],
            handle: _override(endpoint.handle),
          },
        ];
      },
    );

    return {
      ...externals,
      endpoints: { ...externals.endpoints, ...Object.fromEntries(overridden) },
    };
  };

type Overrides = Partial<{
  [TName in keyof Endpoints]: Override<Endpoints[TName]>;
}>;

export type Override<TEndpoint extends UnknownEndpoint> = (
  origin: TEndpoint['handle'],
) => TEndpoint['handle'];

export const record =
  (...endpoints: Array<keyof Endpoints>): Arranger =>
  (externals, config) => {
    const overrides = Object.fromEntries(
      endpoints.map((endpoint): [string, Override<UnknownEndpoint>] => [
        endpoint,
        (origin) => async (args) => {
          config.journal.record(endpoint, {
            query: query(args),
            params: params(args),
            body: await body(args),
          });

          return origin(args);
        },
      ]),
    );

    return override(overrides)(externals, config);
  };
