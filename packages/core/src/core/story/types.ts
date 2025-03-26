import { Group, Story } from './factories/types';

export type StoryTree<TExternals = unknown> =
  | Group<TExternals>
  | Story<TExternals>
  | StoryTree<TExternals>[];
