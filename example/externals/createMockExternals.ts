import { Journal } from '../../src/client/types';
import { IExternals } from './types';

export function createMockExternals(): IExternals {
  return {
    analytics: {
      log: () => {},
    },
    counter: {
      getInitialValue: async () => 0,
    },
    environment: {
      // 13.01.2024
      now: () => new Date(2024, 0, 13, 12),
    },
  };
}

export function createJournalExternals(
  externals: IExternals,
  journal: Journal,
): IExternals {
  return {
    ...externals,
    analytics: {
      ...externals.analytics,
      log: journal.record('log', externals.analytics.log),
    },
  };
}
