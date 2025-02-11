import { GroupID, parseStoryID, PureGroup } from '@storyshots/core';
import { useEffect, useState } from 'react';
import { Selection } from './useSelection/types';

export function useGroupExpand(selection: Selection) {
  const [expanded, setExpanded] = useState(new Set<GroupID>());

  useEffect(() => {
    if (selection.type === 'story') {
      setExpanded(
        (curr) => new Set([...curr, ...parseStoryID(selection.story.id)]),
      );
    }
  }, [selection]);

  return {
    expanded,
    toggleExpanded: (group: PureGroup) =>
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
