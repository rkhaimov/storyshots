import { isNil, PureStoryTree, TreeOP } from '@storyshots/core';
import { UseBehaviourProps } from '../../behaviour/types';
import { TestResults } from '../../behaviour/useTestResults/types';
import { EntryStatus } from '../reusables/EntryStatus/types';
import { getStoryEntryStatus } from '../reusables/getStoryEntryStatus';

export function getGroupEntryStatus(
  results: TestResults,
  selection: UseBehaviourProps['selection'],
  children: PureStoryTree[],
) {
  const statuses = TreeOP.toLeafsArray(children).map((story) =>
    getStoryEntryStatus(results, selection, story),
  );

  return statuses.reduce(merge, undefined);
}

function merge(left: EntryStatus, right: EntryStatus): EntryStatus {
  if (isNil(left)) {
    return right;
  }

  if (isNil(right)) {
    return left;
  }

  if (left.type === 'error' || right.type === 'error') {
    return { type: 'error' };
  }

  if (left.type === 'pass') {
    return right;
  }

  if (right.type === 'pass') {
    return left;
  }

  return {
    type: left.type === 'fail' ? 'fail' : right.type,
    records: [...left.records, ...right.records],
    screenshots: [...left.screenshots, ...right.screenshots],
  };
}
