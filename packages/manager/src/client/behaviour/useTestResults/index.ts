import {
  assertNotEmpty,
  PreviewState,
  PureStory,
  TestConfig,
} from '@storyshots/core';
import { useRef, useState } from 'react';
import { createRunnableStoriesSuits } from '../../../reusables/runner/createRunnableStoriesSuits';
import { driver } from '../../../reusables/runner/driver';
import { run } from '../../../reusables/runner/run';
import {
  AcceptableRecord,
  AcceptableScreenshot,
} from '../../../reusables/runner/types';

import { TestResults } from './types';
import { isOnRun } from '../../../reusables/runner/isOnRun';

export function useTestResults() {
  const [results, setResults] = useState<TestResults>(new Map());
  const abort = useAbort();

  return {
    results,
    stopAll: () => {
      abort.trigger();

      removeAllOnRun();
    },
    run: (stories: PureStory[], config: TestConfig) => {
      const tests = createRunnableStoriesSuits(stories, [config]);

      return run(tests, abort.get(), (id, result) =>
        setResults((results) => new Map(results.set(id, result))),
      );
    },
    runComplete: async (stories: PureStory[], preview: PreviewState) => {
      const tests = createRunnableStoriesSuits(
        stories,
        preview.devices.map((device) => ({ device })),
      );

      return run(tests, abort.get(), (id, result) =>
        setResults((results) => new Map(results.set(id, result))),
      );
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

      const inner = details.screenshots.find((it) => it.result === result);

      assertNotEmpty(inner);

      inner.result = { type: 'pass', actual: result.actual };

      setResults(new Map(results));
    },
  };

  function removeAllOnRun() {
    results.forEach((result, id) => {
      if (result.type === 'success' && result.details.length > 0) {
        result.running = false;
      }

      if (isOnRun(result)) {
        results.delete(id);
      }
    });

    setResults(new Map(results));
  }
}

function useAbort() {
  const controller = useRef(new AbortController());

  return {
    get: (): AbortSignal => {
      if (controller.current.signal.aborted) {
        controller.current = new AbortController();
      }

      return controller.current.signal;
    },
    trigger: (): void => controller.current.abort('Cancelled'),
  };
}
