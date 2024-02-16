import { useMemo } from 'react';
import { assertNotEmpty } from '../../reusables/utils';
import { createActor } from '../createActor';
import { EvaluatedStoryshotsNode } from '../reusables/channel';
import { StoryshotsNode } from '../types';
import { Props } from './types';

export function useManagerState(props: Props) {
  return useMemo(() => {
    const top = window.top;

    assertNotEmpty(top, 'Preview should be wrapped in manager');

    return top.setStoriesAndGetState(toEvaluatedStories(props.stories, props));
  }, [props.stories]);
}

function toEvaluatedStories(nodes: StoryshotsNode[], props: Props) {
  return nodes.map((node): EvaluatedStoryshotsNode => {
    if (node.type === 'group') {
      return { ...node, children: toEvaluatedStories(node.children, props) };
    }

    return {
      id: node.id,
      title: node.title,
      type: 'story',
      devices: props.devices,
      actions: node.act(createActor()).toMeta(),
    };
  });
}
