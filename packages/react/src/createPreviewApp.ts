import { __bindStoryFactories } from '@storyshots/core';
import { createRun } from './createRun';
import { ExternalsFactory } from './types';

export function createPreviewApp<TExternals>(
  factory: ExternalsFactory<TExternals>,
) {
  return {
    ...__bindStoryFactories<TExternals>(),
    run: createRun(factory),
  };
}
