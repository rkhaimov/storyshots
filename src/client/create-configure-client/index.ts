import { describe, it } from '../foundations';
import { createPreviewApp } from '../Preview';
import { StoryTree } from '../types';
import { ClientConfig } from './types';

export function createConfigurePreview<TExternals>(
  config: ClientConfig<TExternals>,
) {
  return {
    describe: describe,
    it: it<TExternals>,
    runPreview: (stories: StoryTree[]) =>
      createPreviewApp({ ...config, stories }),
  };
}
