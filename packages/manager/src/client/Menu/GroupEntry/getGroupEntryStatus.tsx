import { PureStoryTree, TreeOP } from '@storyshots/core';
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

  return {
    status: fold(statuses),
    running: statuses.some((it) => it?.type === 'running'),
  };
}

function fold(statuses: EntryStatus[]): EntryStatus {
  if (statuses.some((it) => it?.type === 'error')) {
    return { type: 'error', message: 'One or more stories contain errors' };
  }

  if (statuses.some((it) => it?.type === 'fail')) {
    return {
      type: 'fail',
      records: statuses.flatMap((it) =>
        it?.type === 'fail' ? it.records : [],
      ),
      screenshots: statuses.flatMap((it) =>
        it?.type === 'fail' ? it.screenshots : [],
      ),
    };
  }

  if (statuses.some((it) => it?.type === 'fresh')) {
    return {
      type: 'fresh',
      records: statuses.flatMap((it) =>
        it?.type === 'fresh' ? it.records : [],
      ),
      screenshots: statuses.flatMap((it) =>
        it?.type === 'fresh' ? it.screenshots : [],
      ),
    };
  }

  if (statuses.some((it) => it?.type === 'running')) {
    return { type: 'running' };
  }

  if (statuses.some((it) => it?.type === 'pass')) {
    return { type: 'pass' };
  }
}
