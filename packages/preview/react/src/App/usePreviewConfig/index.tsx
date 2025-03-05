import { assertNotEmpty } from '@storyshots/core';
import { CreateStoryViewProps } from '../types';

import { toPureStories } from './toPureStories';

export function createConnectToManager(props: CreateStoryViewProps) {
  const parent = window.parent;

  assertNotEmpty(parent, 'Preview should be wrapped in manager');

  return parent.onPreviewReady((manager) => ({
    stories: toPureStories(manager, props.stories),
  }));
}
