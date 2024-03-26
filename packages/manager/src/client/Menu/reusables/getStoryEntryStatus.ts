import { UseBehaviourProps } from '../../behaviour/types';
import {
  RecordsComparisonResult,
  SingleConfigScreenshotResult,
  TestResults,
} from '../../behaviour/useTestResults/types';

import { EntryStatus } from './EntryStatus/types';
import { isNil, PureStory } from '@storyshots/core';

export function getStoryEntryStatus(
  results: TestResults,
  selection: UseBehaviourProps['selection'],
  story: PureStory,
): EntryStatus {
  if (
    selection.type === 'story' &&
    selection.story.id === story.id &&
    selection.playing === false &&
    selection.result.type === 'error'
  ) {
    return { type: 'error', message: selection.result.message };
  }

  const comparison = results.get(story.id);

  if (isNil(comparison) || comparison.running) {
    return null;
  }

  if (comparison.type === 'error') {
    return { type: 'error', message: comparison.message };
  }

  const statuses: ComparisonStatus[] = [
    comparison.records.type,
    ...screenshotsToStatuses(comparison.screenshots.final),
    ...comparison.screenshots.others.flatMap((it) =>
      screenshotsToStatuses(it.results),
    ),
  ];

  if (statuses.includes('fail')) {
    return { type: 'fail' };
  }

  if (statuses.includes('fresh')) {
    return { type: 'fresh' };
  }

  return { type: 'pass' };
}

function screenshotsToStatuses(
  screenshots: SingleConfigScreenshotResult[],
): ComparisonStatus[] {
  return screenshots.map((it) => it.result.type);
}

type ComparisonStatus = RecordsComparisonResult['type'];
