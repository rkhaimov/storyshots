import {
  assertNotEmpty,
  PreviewState,
  PureStory,
  TestConfig,
} from '@storyshots/core';
import { useState } from 'react';

import { useExternals } from '../../externals/context';
import { AcceptableRecord, AcceptableScreenshot } from '../../reusables/types';
import { runSetCompleteTestResults } from './runSetCompleteTestResults';
import { runSetConfiguredTestResults } from './runSetConfiguredTestResults';
import { TestResults } from './types';

export function useTestResults() {
  const { driver } = useExternals();
  const [results, setResults] = useState<TestResults>(new Map());

  return {
    results,
    run: (stories: PureStory[], config: TestConfig, preview: PreviewState) => {
      setChosenAsRunning(stories);

      runSetConfiguredTestResults(driver, setResults, stories, config, preview);
    },
    runComplete: (stories: PureStory[], preview: PreviewState) => {
      setChosenAsRunning(stories);

      runSetCompleteTestResults(driver, setResults, stories, preview);
    },
    // TODO: Logic duplication
    acceptRecords: async ({ id, result, details }: AcceptableRecord) => {
      await driver.acceptRecords(id, {
        records: result.actual,
        device: details.device,
      });

      details.records = {
        type: 'pass',
        actual: result.actual,
      };

      setResults(new Map(results));
    },
    acceptScreenshot: async ({ result, details }: AcceptableScreenshot) => {
      await driver.acceptScreenshot({ actual: result.actual });

      const inner = details.screenshots
        .flatMap((it) => it.results)
        .find((it) => it.result === result);

      assertNotEmpty(inner);

      inner.result = { type: 'pass', actual: result.actual };

      setResults(new Map(results));
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
}
