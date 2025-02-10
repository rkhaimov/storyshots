import { EndpointArgs, UnknownEndpoint } from './types';
import { Override } from './utils';

export const map: Map = (transform) => (origin) => async (arg) => {
  const response = await origin(arg);

  return transform(response as never, arg);
};

export const tap: Tap = (modify) =>
  map(async (response, arg) => {
    await modify(response, arg);

    return response as never;
  });

type Tap = <TEndpoint extends UnknownEndpoint>(
  modify: (
    response: EndpointResponse<TEndpoint>,
    arg: EndpointArgs,
  ) => PromiseLike<void> | void,
) => Override<TEndpoint>;

type Map = <TEndpoint extends UnknownEndpoint>(
  transform: (
    response: EndpointResponse<TEndpoint>,
    arg: EndpointArgs,
  ) => PromiseLike<EndpointResponse<TEndpoint>> | EndpointResponse<TEndpoint>,
) => Override<TEndpoint>;

type EndpointResponse<TEndpoint extends UnknownEndpoint> = Awaited<
  ReturnType<TEndpoint['handle']>
>;
