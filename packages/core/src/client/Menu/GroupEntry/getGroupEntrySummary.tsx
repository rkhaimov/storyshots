import { Group, parseStoryID } from '@core';
import { createSummary } from '../../../reusables/summary';
import { Summary } from '../../../reusables/summary/types';
import { UseBehaviourProps } from '../../behaviour/types';

export function getGroupEntrySummary(
  group: Group,
  { results }: UseBehaviourProps,
): Summary {
  const children = new Map(
    Array.from(results.entries()).filter(([id]) =>
      parseStoryID(id).includes(group.id),
    ),
  );

  return createSummary(children);
}
