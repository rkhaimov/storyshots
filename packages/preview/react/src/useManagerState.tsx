import { useMemo } from 'react';
import {
  assertNotEmpty,
  createManagerConnection,
  PureStoryTree,
  TreeOP,
} from '@storyshots/core';
import { createActor } from './actor';
import { Props, StoryTree } from './types';

export function useManagerState(props: Props) {
  return useMemo(() => {
    const top = window.top;

    assertNotEmpty(top, 'Preview should be wrapped in manager');

    return createManagerConnection(top, {
      stories: toEvaluatedStories(props.stories),
      devices: props.devices,
      presets: props.presets,
    });
  }, [props.stories]);
}

function toEvaluatedStories(nodes: StoryTree[]): PureStoryTree[] {
  return TreeOP.map(nodes, {
    node: (node) => node,
    leaf: (leaf) => ({
      title: leaf.title,
      actions: leaf.act(createActor()).toMeta(),
    }),
  });
}
