import { isNil } from '../../../../reusables/utils';
import { SerializableStoryNode } from '../../../reusables/channel';
import { SelectionState } from '../../behaviour/useSelection';
import {
  RecordsComparisonResult,
  ScreenshotsComparisonResultsByMode,
  TestResults,
} from '../../behaviour/useTestResults/types';
import { EntryStatus } from './EntryTitle';

export function getStoryEntryStatus(
  results: TestResults,
  selection: SelectionState,
  story: SerializableStoryNode,
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
    ...screenshotsToStatuses(comparison.screenshots.primary),
    ...comparison.screenshots.additional.flatMap(screenshotsToStatuses),
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
  screenshots: ScreenshotsComparisonResultsByMode,
): ComparisonStatus[] {
  return [
    screenshots.results.final.type,
    ...screenshots.results.others.map((it) => it.result.type),
  ];
}

type ComparisonStatus = RecordsComparisonResult['type'];
