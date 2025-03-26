import { StoryID, StoryTree } from '@core';
import { useRef, useState } from 'react';
import { run } from '../../reusables/runner/run';
import { DeviceToTestRunState } from '../../reusables/runner/types';
import { ManagerConfig } from './useSelection/useManagerConfig';

export type TestResults = Map<StoryID, DeviceToTestRunState>;

export function useRun(manager: ManagerConfig) {
  const [results, setResults] = useState<TestResults>(new Map());
  const abort = useAbort();

  return {
    results,
    setResults,

    run: (stories: StoryTree) =>
      run({
        on: [manager.device.selected],
        stories,
        abort: abort.get(),
        size: manager.size,
        onResult: (id, result) =>
          setResults((results) => new Map(results.set(id, result))),
      }),

    runComplete: (stories: StoryTree) =>
      run({
        on: manager.devices,
        stories,
        size: manager.size,
        abort: abort.get(),
        onResult: (id, result) =>
          setResults((results) => new Map(results.set(id, result))),
      }),

    stopAll: () => abort.trigger(),
  };
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
