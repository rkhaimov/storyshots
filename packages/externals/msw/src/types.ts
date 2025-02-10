import type { HttpResponseResolver } from 'msw';

export interface Endpoints {}

export type EndpointsLike = Record<string, UnknownEndpoint>;

export type Endpoint<TResponse> = {
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE';
  url: string;
  handle(args: EndpointArgs): PromiseLike<TResponse> | TResponse;
};

export type EndpointArgs = Parameters<HttpResponseResolver>[0];

export type UnknownEndpoint = Endpoint<unknown>;
