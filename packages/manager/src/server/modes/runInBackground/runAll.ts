import { StoryID } from '@storyshots/core';
import {
  getAcceptableRecords,
  getAcceptableScreenshots,
} from '../../../reusables/runner/acceptables';
import { isOnRun } from '../../../reusables/runner/isOnRun';
import { run, RunConfig } from '../../../reusables/runner/run';
import {
  AcceptableRecord,
  AcceptableScreenshot,
  ErrorTestResult,
  TestResult,
} from '../../../reusables/runner/types';
import { RunnableStoriesSuit } from '../../../reusables/types';
import { ManagerConfig } from '../../types';

export async function runAll(
  stories: RunnableStoriesSuit[],
  config: ManagerConfig,
) {
  const errors = new Map<StoryID, ErrorTestResult>();
  const records: AcceptableRecord[] = [];
  const screenshots: AcceptableScreenshot[] = [];

  await run({
    stories,
    abort: new AbortController().signal,
    size: config.runner.size,
    onResult: withResultsRenderer(stories, (id, result) => {
      if (isOnRun(result)) {
        return;
      }

      if (result.type === 'error') {
        errors.set(id, result);

        return;
      }

      records.push(...getAcceptableRecords(id, result.details));
      screenshots.push(...getAcceptableScreenshots(result.details));
    }),
  });

  return {
    errors,
    records,
    screenshots,
  };
}

function withResultsRenderer(
  stories: RunnableStoriesSuit[],
  onResult: RunConfig['onResult'],
): RunConfig['onResult'] {
  const ran = new Map<StoryID, TestResult>();
  return (id, result) => {
    ran.set(id, result);

    console.clear();

    const pass = Array.from(ran.values()).filter(
      (results) => results.type === 'success' && !results.running,
    ).length;

    const errors = Array.from(ran.values()).filter(
      ({ type }) => type === 'error',
    ).length;

    console.log(`Progress: ${pass}/${stories.length}`);
    console.log('Errors:', errors);

    onResult(id, result);
  };
}
