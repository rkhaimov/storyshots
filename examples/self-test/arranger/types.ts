import type { App } from '../../../packages/preview/react/src/App';
import React from 'react';
import { IExternals } from '../../../packages/manager/src/client/externals/types';
import { IWebDriver } from '../../../packages/manager/src/reusables/types';
import type {
  describe,
  it,
} from '../../../packages/preview/react/src/factories';
import {
  ClientConfig,
  StoryTree,
} from '../../../packages/preview/react/src/types';

export type Arranger<TExternals> = {
  stories(create: StoryFactory<TExternals>): Arranger<TExternals>;
  config(
    transform: (config: ClientConfig<TExternals>) => ClientConfig<TExternals>,
  ): Arranger<TExternals>;
  driver(transform: (driver: IWebDriver) => IWebDriver): Arranger<TExternals>;
  build(): (externals: IExternals) => IExternals;
};

export type StoryFactory<TExternals> = (
  factories: Factories<TExternals>,
) => StoryTree[];

export type Factories<TExternals> = {
  it: typeof it<TExternals>;
  describe: typeof describe;
};

export type Props = React.ComponentProps<typeof App>;
