import { Endpoints } from './types';
import { JournalStoryConfig } from '@storyshots/core';

export type Arranger = <TExternals extends { endpoints: Endpoints }>(
  externals: TExternals,
  config: JournalStoryConfig,
) => TExternals;
