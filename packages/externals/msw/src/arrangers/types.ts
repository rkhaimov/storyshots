import { Arranger, UnknownArranger } from '@storyshots/arrangers';
import { Endpoints, UnknownEndpoint } from '../types';

export type UnknownMSWArrangers = {
  endpoint(name: string, endpoint: UnknownEndpoint): UnknownArranger;
  handle(name: string, handle: UnknownEndpoint['handle']): UnknownArranger;
  record(...names: string[]): UnknownArranger;
};

export type MSWArrangers<TExternals> = {
  handle<TEndpoint extends keyof Endpoints>(
    name: TEndpoint,
    handle: Endpoints[TEndpoint]['handle'],
  ): Arranger<TExternals>;
  record(...endpoints: Array<keyof Endpoints>): Arranger<TExternals>;
  endpoint<TEndpoint extends keyof Endpoints>(
    name: TEndpoint,
    endpoint: Endpoints[TEndpoint],
  ): Arranger<TExternals>;
};
