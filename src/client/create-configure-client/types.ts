import { Journal, StoryshotsNode } from '../types';

export type ClientConfig<TExternals> = {
  createExternals(): TExternals;
  createJournalExternals(externals: TExternals, journal: Journal): TExternals;
};

export type FinalClientConfig = ClientConfig<unknown> & {
  stories: StoryshotsNode[];
};
