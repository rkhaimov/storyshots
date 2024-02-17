import { useEffect, useRef, useState } from 'react';
import { EvaluatedGroup } from '../../reusables/channel';
import { AutoPlaySelection } from './useAutoPlaySelection';
import { GroupID } from '../../../reusables/types';
import { TreeOP } from '../../../reusables/tree';

export function useGroupExpand(initial: AutoPlaySelection) {
  const [expanded, setExpanded] = useState(new Set<GroupID>());
  const prev = usePrevious(initial);

  useEffect(() => {
    if (prev.type === 'initializing' && initial.type !== 'initializing') {
      setExpanded(createInitialState(initial));
    }
  }, [initial]);

  return {
    expanded,
    toggleGroupExpanded: (group: EvaluatedGroup) =>
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
  initial: Exclude<AutoPlaySelection, { type: 'initializing' }>,
): Set<GroupID> {
  if (initial.type === 'no-selection') {
    return new Set();
  }

  return new Set(TreeOP.parseInterNodeIDsChain(initial.story.id));
}

function usePrevious<T>(value: T): T {
  const prev = useRef(value);

  useEffect(() => {
    prev.current = value;
  }, [value]);

  return prev.current;
}
