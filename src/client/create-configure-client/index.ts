import { createGroup, createStory } from '../foundations';
import { createPreviewApp } from '../Preview';
import { StoryshotsNode } from '../types';
import { ClientConfig } from './types';

export function createConfigureClient<TExternals>(
  config: ClientConfig<TExternals>,
) {
  return {
    createGroup: createGroup,
    createStory: createStory<TExternals>,
    run: (stories: StoryshotsNode[]) =>
      createPreviewApp({ ...config, stories }),
  };
}
