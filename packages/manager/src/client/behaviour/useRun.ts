import { PureStoryTree, StoryID } from '@storyshots/core';
import { useRef, useState } from 'react';
import { run } from '../../reusables/runner/run';
import { DeviceToTestRunState } from '../../reusables/runner/types';
import { ManagerConfig } from './useSelection/useManagerConfig';

export type TestResults = Map<StoryID, DeviceToTestRunState>;

/**
 * Manages test execution results, provides control over test runs.
 */
export function useRun(manager: ManagerConfig) {
  const [results, setResults] = useState<TestResults>(new Map());
  const abort = useAbort();

  return {
    results,
    setResults,
    /**
     * Runs tests on a selected device.
     *
     * @param stories - The list of stories to execute.
     */
    run: (stories: PureStoryTree[]) =>
      run({
        on: [manager.device.selected],
        stories,
        abort: abort.get(),
        size: manager.size,
        onResult: (id, result) =>
          setResults((results) => new Map(results.set(id, result))),
      }),

    /**
     * Runs tests across all configured devices.
     *
     * @param stories - The list of stories to execute.
     */
    runComplete: (stories: PureStoryTree[]) =>
      run({
        on: manager.devices,
        stories,
        size: manager.size,
        abort: abort.get(),
        onResult: (id, result) =>
          setResults((results) => new Map(results.set(id, result))),
      }),

    /** Stops all running tests. */
    stopAll: () => abort.trigger(),
  };
}

/**
 * Provides an abort signal to control test execution.
 */
function useAbort() {
  const controller = useRef(new AbortController());

  return {
    /**
     * Retrieves the current abort signal, creating a new one if necessary.
     */
    get: (): AbortSignal => {
      if (controller.current.signal.aborted) {
        controller.current = new AbortController();
      }

      return controller.current.signal;
    },
    /** Triggers the abort signal, canceling all ongoing tests. */
    trigger: (): void => controller.current.abort('Cancelled'),
  };
}
