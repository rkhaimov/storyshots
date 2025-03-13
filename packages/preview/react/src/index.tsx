import { createRun } from './createRun';
import { describe } from './tree/describe';
import { each } from './tree/each';
import { it } from './tree/it';
import { ExternalsFactory } from './types';

export function createPreviewApp<TExternals>(
  factory: ExternalsFactory<TExternals>,
) {
  return {
    describe: describe,

    it: it<TExternals>,

    each: each,
    run: createRun(factory),
  };
}

export { masked } from './masked';
export type { ExternalsFactory };
export type { StoryTree } from './tree/types';
export type { Story } from './tree/it';
export type { StoryAggregate } from './tree/each';
export type { Group } from './tree/describe';
