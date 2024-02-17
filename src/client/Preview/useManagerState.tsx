import { useMemo } from 'react';
import { assertNotEmpty } from '../../reusables/utils';
import { createActor } from '../createActor';
import { EvaluatedStoryTree } from '../reusables/channel';
import { StoryTree } from '../types';
import { Props } from './types';
import { TreeOP } from '../../reusables/tree';

export function useManagerState(props: Props) {
  return useMemo(() => {
    const top = window.top;

    assertNotEmpty(top, 'Preview should be wrapped in manager');

    return top.setStoriesAndGetState(toEvaluatedStories(props.stories, props));
  }, [props.stories]);
}

function toEvaluatedStories(
  nodes: StoryTree[],
  props: Props,
): EvaluatedStoryTree[] {
  return TreeOP.map(nodes, {
    node: (node) => node,
    leaf: (leaf) => ({
      title: leaf.title,
      devices: props.devices,
      actions: leaf.act(createActor()).toMeta(),
    }),
  });
}
