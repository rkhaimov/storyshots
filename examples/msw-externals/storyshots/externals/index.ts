import { JournalStoryConfig } from '@storyshots/core';
import { Endpoints } from '@storyshots/msw-externals';

export function createMockExternals(): Externals {
  return { endpoints: {} as Endpoints };
}

export function createJournalExternals(externals: Externals) {
  return externals;
}

export type Externals = {
  endpoints: Endpoints;
};

export type Arranger = (
  externals: Externals,
  config: JournalStoryConfig,
) => Externals;

export function arrange(...arrangers: Arranger[]): Arranger {
  return (externals, config) =>
    arrangers.reduce((curr, override) => override(curr, config), externals);
}
