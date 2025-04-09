import { Device, StoryID } from '@core';
import { assert, assertNotEmpty } from '@lib';
import { useState } from 'react';
import { driver } from '../../reusables/runner/driver';
import {
  AcceptableRecords,
  AcceptableScreenshot,
} from '../../reusables/runner/types';
import { ChangeSummary } from '../../reusables/summary/types';
import { useRun } from './useRun';

export function useAcceptBaseline(run: ReturnType<typeof useRun>) {
  const [accepting, setAccepting] = useState(false);

  const result = {
    accepting,

    accept: async (changes: ChangeSummary[]) => {
      setAccepting(true);

      for (const change of changes) {
        if (change.records) {
          await result.acceptRecords(change.id, change.device, change.records);
        }

        for (const screenshot of change.screenshots) {
          await result.acceptScreenshot(change.id, change.device, screenshot);
        }
      }

      setAccepting(false);
    },

    acceptRecords: async (
      id: StoryID,
      device: Device,
      records: AcceptableRecords,
    ) => {
      await driver.acceptRecords({ id, device, records });

      const results = run.results.get(id);

      assertNotEmpty(results);

      const state = results.get(device);

      assertNotEmpty(state);
      assert(state.type === 'done');
      assert(state.details.type === 'success');

      mutate(state.details.data.records, {
        type: 'pass',
        actual: records.actual,
      });

      run.setResults(new Map(run.results));
    },

    acceptScreenshot: async (
      id: StoryID,
      device: Device,
      screenshot: AcceptableScreenshot,
    ) => {
      await driver.acceptScreenshot(screenshot);

      const results = run.results.get(id);

      assertNotEmpty(results);

      const state = results.get(device);

      assertNotEmpty(state);
      assert(state.type === 'done');
      assert(state.details.type === 'success');

      const found = state.details.data.screenshots.find(
        (it) => it.name === screenshot.name,
      );

      assertNotEmpty(found);

      mutate(found, {
        type: 'pass',
        name: found.name,
        actual: screenshot.actual,
      });

      run.setResults(new Map(run.results));
    },
  };

  return result;
}

function mutate<T extends Record<string, unknown>>(target: T, source: T): void {
  Object.assign(target, source);
}
