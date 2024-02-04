import { Journal, StoryshotsNode } from '../types';
import { PageMode } from '../../reusables/types';

export type Modes = {
  primary: PageMode;
  additional: PageMode[];
};

export type ClientConfig<TExternals> = {
  modes: Modes;
  createExternals(): TExternals;
  createJournalExternals(externals: TExternals, journal: Journal): TExternals;
};

export type FinalClientConfig = ClientConfig<unknown> & {
  stories: StoryshotsNode[];
};
