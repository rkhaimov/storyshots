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

    return top.setAppConfigAndGetState(
      toEvaluatedStories(props.stories),
      props.devices,
      props.presets,
    );
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
