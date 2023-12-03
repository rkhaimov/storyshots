import { useState } from 'react';
import {
  JournalRecord,
  ScreenshotName,
  ScreenshotPath,
} from '../../../../reusables/types';
import { useExternals } from '../../../externals/Context';
import { SerializableStoryNode } from '../../../reusables/channel';
import { createRunTestResult } from './createRunTestResult';
import {
  ReadyTestResult,
  RecordsComparisonResult,
  ScreenshotComparisonResult,
  TestResults,
} from './types';

export function useTestResults() {
  const externals = useExternals();
  const [results, setResults] = useState<TestResults>(new Map());

  return {
    results,
    run: async (stories: SerializableStoryNode[]) => {
      setChosenAsRunning(stories);

      runSetTestResults(stories);
    },
    // TODO: Logic duplication
    acceptRecords: async (
      story: SerializableStoryNode,
      records: JournalRecord[],
      ready: ReadyTestResult,
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
      story: SerializableStoryNode,
      name: ScreenshotName | undefined,
      path: ScreenshotPath,
      ready: ReadyTestResult,
    ) => {
      await externals.driver.acceptScreenshot({ actual: path });

      const pass: ScreenshotComparisonResult = { type: 'pass', actual: path };

      setResults(
        new Map(
          results.set(story.id, {
            ...ready,
            screenshots: {
              final: name === undefined ? pass : ready.screenshots.final,
              others: ready.screenshots.others.map((other) =>
                other.name === name ? { name, result: pass } : other,
              ),
            },
          }),
        ),
      );
    },
  };

  function setChosenAsRunning(stories: SerializableStoryNode[]) {
    return setResults(
      stories.reduce(
        (acc, story) => acc.set(story.id, { running: true }),
        new Map(results),
      ),
    );
  }

  async function runSetTestResults(stories: SerializableStoryNode[]) {
    for (const story of stories) {
      const result = await createRunTestResult(externals.driver, story);

      setResults((curr) => new Map(curr.set(story.id, result)));
    }
  }
}
