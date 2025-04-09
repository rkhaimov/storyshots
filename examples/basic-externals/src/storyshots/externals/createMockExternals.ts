import { StoryConfig } from '@storyshots/core';
import { IExternals } from '../../externals/types';

export function createMockExternals(): IExternals {
  return {
    analytics: {
      log: () => {},
    },
    business: {
      getBalanceAt: async () => 0,
      applyCV: async () => {},
    },
  };
}

export function createJournalExternals(
  externals: IExternals,
  { journal }: StoryConfig,
): IExternals {
  return {
    ...externals,
    analytics: {
      ...externals.analytics,
      log: journal.asRecordable('log', externals.analytics.log),
    },
    business: {
      ...externals.business,
      applyCV: journal.asRecordable('applyCV', externals.business.applyCV),
    },
  };
}
