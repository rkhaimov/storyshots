import { useEffect, useState } from 'react';
import { GroupID } from '../../reusables/types';
import { PureGroup, TreeOP } from '@storyshots/core';
import { Selection } from './useSelection/types';

export function useGroupExpand(selection: Selection) {
  const [expanded, setExpanded] = useState(new Set<GroupID>());

  useEffect(() => {
    if (selection.type === 'story') {
      setExpanded(
        (curr) =>
          new Set([
            ...curr,
            ...TreeOP.parseInterNodeIDsChain(selection.story.id),
          ]),
      );
    }
  }, [selection]);

  return {
    expanded,
    toggleGroupExpanded: (group: PureGroup) =>
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
