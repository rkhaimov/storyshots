import { useEffect, useRef, useState } from 'react';
import { not } from '../../../reusables/utils';
import {
  EvaluatedGroupNode,
  EvaluatedStoryNode,
  EvaluatedStoryshotsNode,
} from '../../reusables/channel';
import { RichSelection } from './useRichSelection';

export function useGroupExpand(initial: RichSelection) {
  const [expanded, setExpanded] = useState(new Set<string>());
  const prev = usePrevious(initial);

  useEffect(() => {
    if (prev.type === 'initializing' && initial.type !== 'initializing') {
      setExpanded(createInitialState(initial));
    }
  }, [initial]);

  return {
    expanded,
    toggleGroupExpanded: (group: EvaluatedGroupNode) =>
      setExpanded((prev) => {
        if (prev.has(group.id)) {
          prev.delete(group.id);
        } else {
          prev.add(group.id);
        }

        return new Set(prev);
      }),
  };
}

function createInitialState(
  initial: Exclude<RichSelection, { type: 'initializing' }>,
): Set<string> {
  if (initial.type === 'no-selection') {
    return new Set();
  }

  return new Set(findParentsChain(initial.stories, initial.story));
}

function findParentsChain(
  node: EvaluatedStoryshotsNode[],
  story: EvaluatedStoryNode,
): string[] {
  const [head, ...tail] = node;

  if (head.type === 'story') {
    return head.id === story.id ? [] : findParentsChain(tail, story);
  }

  const inside = story.id.includes(head.id);

  if (not(inside)) {
    return findParentsChain(tail, story);
  }

  return [head.id, ...findParentsChain(head.children, story)];
}

function usePrevious<T>(value: T): T {
  const prev = useRef(value);

  useEffect(() => {
    prev.current = value;
  }, [value]);

  return prev.current;
}
