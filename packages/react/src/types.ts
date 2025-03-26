import { StoryConfig } from '@storyshots/core';

export type ExternalsFactory<TExternals> = {
  createExternals(config: StoryConfig): TExternals;

  createJournalExternals(
    externals: TExternals,
    config: StoryConfig,
  ): TExternals;
};
