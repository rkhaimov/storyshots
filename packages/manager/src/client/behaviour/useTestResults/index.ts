import { assertNotEmpty } from '@storyshots/core';
import { driver } from '../../../reusables/runner/driver';
import {
  AcceptableRecord,
  AcceptableScreenshot,
} from '../../../reusables/runner/types';
import { useRunner } from './useRunner';

export function useTestResults() {
  const { results, setResults, run, runComplete, stopAll } = useRunner();

  return {
    results,
    run,
    runComplete,
    stopAll,
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

      const inner = details.screenshots.find((it) => it.result === result);

      assertNotEmpty(inner);

      inner.result = { type: 'pass', actual: result.actual };

      setResults(new Map(results));
    },
  };
}
