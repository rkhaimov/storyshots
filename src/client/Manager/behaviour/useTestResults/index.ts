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
  SuccessTestResult,
  TestResults,
} from './types';

export function useTestResults() {
  const externals = useExternals();
  const [results, setResults] = useState<TestResults>(new Map());

  return {
    results,
    run: async (stories: EvaluatedStoryNode[]) => {
      setChosenAsRunning(stories);

      runSetTestResults(stories);
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
      path: ScreenshotPath,
      ready: SuccessTestResult,
    ) => {
      await externals.driver.acceptScreenshot({ actual: path });

      const pass: ScreenshotComparisonResult = { type: 'pass', actual: path };

      setResults(
        new Map(
          results.set(story.id, {
            ...ready,
            screenshots: {
              primary: {
                device: ready.screenshots.primary.device,
                results: {
                  final:
                    name === undefined
                      ? pass
                      : ready.screenshots.primary.results.final,
                  others: ready.screenshots.primary.results.others.map(
                    (other) =>
                      other.name === name ? { name, result: pass } : other,
                  ),
                },
              },
              additional: [],
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
      const result = await createRunTestResult(externals.driver, story);

      setResults((curr) => new Map(curr.set(story.id, result)));
    }
  }
}
