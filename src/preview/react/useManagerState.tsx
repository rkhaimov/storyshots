import { useMemo } from 'react';
import { PureStoryTree } from '../../reusables/story';
import { assertNotEmpty } from '../../reusables/utils';
import { createActor } from './actor';
import { Props, StoryTree } from './types';
import { TreeOP } from '../../reusables/tree';

export function useManagerState(props: Props) {
  return useMemo(() => {
    const top = window.top;

    assertNotEmpty(top, 'Preview should be wrapped in manager');

    return top.setStoriesAndGetState(toEvaluatedStories(props.stories, props));
  }, [props.stories]);
}

function toEvaluatedStories(nodes: StoryTree[], props: Props): PureStoryTree[] {
  return TreeOP.map(nodes, {
    node: (node) => node,
    leaf: (leaf) => ({
      title: leaf.title,
      devices: props.devices,
      actions: leaf.act(createActor()).toMeta(),
    }),
  });
}
