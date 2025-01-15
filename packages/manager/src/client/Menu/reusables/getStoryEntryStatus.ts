import { isNil, PureStory } from '@storyshots/core';
import {
  getAcceptableRecords,
  getAcceptableScreenshots,
} from '../../../reusables/runner/acceptables';
import {
  AcceptableRecord,
  AcceptableScreenshot,
} from '../../../reusables/runner/types';
import { UseBehaviourProps } from '../../behaviour/types';
import { TestResults } from '../../behaviour/useTestResults/types';

import { EntryStatus } from './EntryStatus/types';

export function getStoryEntryStatus(
  results: TestResults,
  selection: UseBehaviourProps['selection'],
  story: PureStory,
): EntryStatus {
  if (selection.type === 'story' && selection.story.id === story.id) {
    if (selection.state.type === 'playing') {
      return { type: 'running' };
    }

    if (
      selection.state.type === 'played' &&
      selection.state.result.type === 'error'
    ) {
      return { type: 'error', message: selection.state.result.message };
    }
  }

  const comparison = results.get(story.id);

  if (isNil(comparison)) {
    return;
  }

  if (comparison.type === 'scheduled') {
    return { type: 'scheduled' };
  }

  if (comparison.type === 'error') {
    return comparison;
  }

  if (comparison.running) {
    return { type: 'running' };
  }

  const records = getAcceptableRecords(story.id, comparison.details);
  const screenshots = getAcceptableScreenshots(comparison.details);

  if (records.length === 0 && screenshots.length === 0) {
    return { type: 'pass' };
  }

  return {
    type: liftFailWhenPresented(records, screenshots),
    records,
    screenshots,
  };
}

function liftFailWhenPresented(
  records: AcceptableRecord[],
  screenshots: AcceptableScreenshot[],
): 'fresh' | 'fail' {
  return [
    ...records.map((it) => it.result.type),
    ...screenshots.map((it) => it.result.type),
  ].includes('fail')
    ? 'fail'
    : 'fresh';
}
