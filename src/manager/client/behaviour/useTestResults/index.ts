import { useState } from 'react';
import { JournalRecord } from '../../../../reusables/journal';
import { ScreenshotName } from '../../../../reusables/screenshot';
import { PureStory } from '../../../../reusables/story';
import { isNil } from '../../../../reusables/utils';
import { ScreenshotPath } from '../../../reusables/types';
import { useDriver } from '../../driver';
import { createRunTestResult } from './createRunTestResult';
import {
  RecordsComparisonResult,
  ScreenshotComparisonResult,
  ScreenshotsComparisonResultsByMode,
  SuccessTestResult,
  TestResults,
} from './types';

export function useTestResults() {
  const externals = useDriver();
  const [results, setResults] = useState<TestResults>(new Map());

  return {
    results,
    run: async (stories: PureStory[]) => {
      setChosenAsRunning(stories);

      runSetTestResults(stories);
    },
    runComplete: async (stories: PureStory[]) => {
      setChosenAsRunning(stories);

      runCompleteSetTestResults(stories);
    },
    // TODO: Logic duplication
    acceptRecords: async (
      story: PureStory,
      records: JournalRecord[],
      ready: SuccessTestResult,
    ) => {
      await externals.acceptRecords(story.id, records);

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
      story: PureStory,
      name: ScreenshotName | undefined,
      device: string | undefined,
      path: ScreenshotPath,
      ready: SuccessTestResult,
    ) => {
      await externals.acceptScreenshot({ actual: path });

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

  function setChosenAsRunning(stories: PureStory[]) {
    return setResults(
      stories.reduce(
        (acc, story) => acc.set(story.id, { running: true }),
        new Map(results),
      ),
    );
  }

  async function runSetTestResults(stories: PureStory[]) {
    for (const story of stories) {
      const result = await createRunTestResult(externals, story, false);

      setResults((curr) => new Map(curr.set(story.id, result)));
    }
  }

  async function runCompleteSetTestResults(stories: PureStory[]) {
    for (const story of stories) {
      const result = await createRunTestResult(externals, story, true);

      setResults((curr) => new Map(curr.set(story.id, result)));
    }
  }
}
