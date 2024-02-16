import { createGroup, createStory } from '../foundations';
import { createPreviewApp } from '../Preview';
import { StoryshotsNode } from '../types';
import { ClientConfig } from './types';

export function createConfigurePreview<TExternals>(
  config: ClientConfig<TExternals>,
) {
  return {
    createGroup: createGroup,
    createStory: createStory<TExternals>,
    runPreview: (stories: StoryshotsNode[]) =>
      createPreviewApp({ ...config, stories }),
  };
}
