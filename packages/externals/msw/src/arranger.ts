import { Endpoints } from './types';
import { StoryConfig } from '@storyshots/core';

export type Arranger = <TExternals extends { endpoints: Endpoints }>(
  externals: TExternals,
  config: StoryConfig,
) => TExternals;
