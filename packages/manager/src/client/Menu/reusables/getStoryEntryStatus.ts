import { isNil, PureStory } from '@storyshots/core';
import { UseBehaviourProps } from '../../behaviour/types';
import {
  TestResultDetails,
  TestResults,
} from '../../behaviour/useTestResults/types';
import { AcceptableRecord, AcceptableScreenshot } from '../../reusables/types';

import { EntryStatus } from './EntryStatus/types';

export function getStoryEntryStatus(
  results: TestResults,
  selection: UseBehaviourProps['selection'],
  story: PureStory,
): EntryStatus {
  if (selection.type === 'story' && selection.story.id === story.id) {
    if (selection.playing) {
      return { type: 'running' };
    }

    if (selection.result.type === 'error') {
      return { type: 'error', message: selection.result.message };
    }
  }

  const comparison = results.get(story.id);

  if (isNil(comparison)) {
    return;
  }

  if (comparison.running) {
    return { type: 'running' };
  }

  if (comparison.type === 'error') {
    return comparison;
  }

  const records = getAcceptableRecords(story, comparison.details);
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

function getAcceptableRecords(
  story: PureStory,
  details: TestResultDetails[],
): AcceptableRecord[] {
  return details
    .filter((it) => it.records.type !== 'pass')
    .map((it) => ({
      id: story.id,
      details: it,
      result: it.records as never,
    }));
}

function getAcceptableScreenshots(
  details: TestResultDetails[],
): AcceptableScreenshot[] {
  return details.flatMap((detail) =>
    detail.screenshots
      .flatMap((it) => it.results)
      .map((it) => it.result)
      .filter((it): it is AcceptableScreenshot['result'] => it.type !== 'pass')
      .map((it) => ({ details: detail, result: it })),
  );
}
