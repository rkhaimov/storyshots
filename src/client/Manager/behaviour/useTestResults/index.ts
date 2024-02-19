import { useState } from 'react';
import {
  JournalRecord,
  ScreenshotName,
  ScreenshotPath,
} from '../../../../reusables/types';
import { useExternals } from '../../../externals/Context';
import { EvaluatedStoryNode } from '../../../reusables/channel';
import { createRunTestResult } from './createRunTestResult';
import {
  RecordsComparisonResult,
  ScreenshotComparisonResult,
  ScreenshotsComparisonResultsByMode,
  SuccessTestResult,
  TestResults,
} from './types';
import { isNil } from '../../../../reusables/utils';

export function useTestResults() {
  const externals = useExternals();
  const [results, setResults] = useState<TestResults>(new Map());

  return {
    results,
    run: async (stories: EvaluatedStoryNode[]) => {
      setChosenAsRunning(stories);

      runSetTestResults(stories);
    },
    runComplete: async (stories: EvaluatedStoryNode[]) => {
      setChosenAsRunning(stories);

      runCompleteSetTestResults(stories);
    },
    // TODO: Logic duplication
    acceptRecords: async (
      story: EvaluatedStoryNode,
      records: JournalRecord[],
      ready: SuccessTestResult,
    ) => {
      await externals.driver.acceptRecords(story.id, records);

      const pass: RecordsComparisonResult = { type: 'pass', actual: records };

      setResults(
        new Map(
          results.set(story.id, {
            ...ready,
            records: pass,
          }),
        ),
      );
    },
    acceptScreenshot: async (
      story: EvaluatedStoryNode,
      name: ScreenshotName | undefined,
      device: string | undefined,
      path: ScreenshotPath,
      ready: SuccessTestResult,
    ) => {
      await externals.driver.acceptScreenshot({ actual: path });

      const pass: ScreenshotComparisonResult = { type: 'pass', actual: path };

      function deriveScreenshotResults(
        results: ScreenshotsComparisonResultsByMode,
      ) {
        return {
          device: results.device,
          results: {
            final: name === undefined ? pass : results.results.final,
            others: results.results.others.map((other) =>
              other.name === name ? { name, result: pass } : other,
            ),
          },
        };
      }

      setResults(
        new Map(
          results.set(story.id, {
            ...ready,
            screenshots: {
              primary:
                isNil(device) ||
                ready.screenshots.primary.device.name === device
                  ? deriveScreenshotResults(ready.screenshots.primary)
                  : ready.screenshots.primary,
              additional: ready.screenshots.additional.map((additional) => {
                if (additional.device.name !== device) {
                  return additional;
                }

                return deriveScreenshotResults(additional);
              }),
            },
          }),
        ),
      );
    },
  };

  function setChosenAsRunning(stories: EvaluatedStoryNode[]) {
    return setResults(
      stories.reduce(
        (acc, story) => acc.set(story.id, { running: true }),
        new Map(results),
      ),
    );
  }

  async function runSetTestResults(stories: EvaluatedStoryNode[]) {
    for (const story of stories) {
      const result = await createRunTestResult(externals.driver, story, false);

      setResults((curr) => new Map(curr.set(story.id, result)));
    }
  }

  async function runCompleteSetTestResults(stories: EvaluatedStoryNode[]) {
    for (const story of stories) {
      const result = await createRunTestResult(externals.driver, story, true);

      setResults((curr) => new Map(curr.set(story.id, result)));
    }
  }
}
