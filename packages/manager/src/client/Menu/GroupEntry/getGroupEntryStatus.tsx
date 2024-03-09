import { UseBehaviourProps } from '../../behaviour/types';
import { TestResults } from '../../behaviour/useTestResults/types';
import { EntryStatus } from '../reusables/EntryStatus/types';
import { getStoryEntryStatus } from '../reusables/getStoryEntryStatus';
import { PureStoryTree, TreeOP } from '@storyshots/core';

export function getGroupEntryStatus(
  results: TestResults,
  selection: UseBehaviourProps['selection'],
  children: PureStoryTree[],
): EntryStatus {
  const statuses = TreeOP.toLeafsArray(children).map((story) =>
    getStoryEntryStatus(results, selection, story),
  );

  const error = statuses.find((it) => it?.type === 'error');

  if (error) {
    return {
      type: 'error',
      message: 'One or more stories contain errors. Please, check insides',
    };
  }

  const fail = statuses.find((it) => it?.type === 'fail');

  if (fail) {
    return fail;
  }

  const fresh = statuses.find((it) => it?.type === 'fresh');

  if (fresh) {
    return fresh;
  }

  if (statuses.length > 0 && statuses.every((it) => it?.type === 'pass')) {
    return { type: 'pass' };
  }

  return null;
}
