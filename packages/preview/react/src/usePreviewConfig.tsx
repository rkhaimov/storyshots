import {
  assertNotEmpty,
  Channel,
  Device,
  PreviewConfig,
  PreviewState,
  PureStoryTree,
  TreeOP,
} from '@storyshots/core';
import { useMemo } from 'react';
import { PreviewProps, StoryTree } from './types';

export function usePreviewConfig(props: PreviewProps) {
  return useMemo(
    () =>
      getPreviewConfig({
        stories: toPureStories(props.stories),
        devices: props.devices as Device[],
      }),
    [props.stories],
  );
}

function getPreviewConfig(preview: PreviewState): PreviewConfig {
  const parent = window.parent;

  assertNotEmpty(parent, 'Preview should be wrapped in manager');

  return (parent as never as Channel).state(preview);
}

function toPureStories(nodes: StoryTree[]): PureStoryTree[] {
  return TreeOP.map(nodes, {
    node: (node) => node,
    leaf: (leaf) => ({
      title: leaf.title,
      retries: leaf.retries,
      act: leaf.act,
    }),
  });
}
