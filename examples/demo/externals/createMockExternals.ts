import { JournalStoryConfig, StoryConfig } from '@storyshots/core';
import { IExternals, ThemeName } from './types';

export function createMockExternals({ presets }: StoryConfig): IExternals {
  return {
    analytics: {
      log: () => {},
    },
    business: {
      getBalanceAt: async () => 0,
      applyCV: async () => {},
    },
    environment: {
      // 13.01.2024
      now: () => new Date(2024, 0, 13, 12),
    },
    options: {
      getTheme: () => (presets['Theme']?.toLowerCase() as ThemeName) ?? 'light',
    },
  };
}

export function createJournalExternals(
  externals: IExternals,
  { journal }: JournalStoryConfig,
): IExternals {
  return {
    ...externals,
    analytics: {
      ...externals.analytics,
      log: journal.record('log', externals.analytics.log),
    },
    business: {
      ...externals.business,
      applyCV: journal.record('applyCV', externals.business.applyCV),
    },
  };
}
