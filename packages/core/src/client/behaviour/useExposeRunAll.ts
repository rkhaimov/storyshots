import { StoryID } from '@core';
import { run } from '../../reusables/runner/run';
import { DeviceToTestRunState } from '../../reusables/runner/types';
import { createSummary } from '../../reusables/summary';
import { Selection } from './useSelection/types';
import { ManagerConfig } from './useSelection/useManagerConfig';

export function useExposeRunAll(state: Selection, manager: ManagerConfig) {
  window.runAll = () => {
    if (state.type === 'initializing') {
      return;
    }

    const ran = new Map<StoryID, DeviceToTestRunState>();

    return run({
      stories: state.stories,
      on: manager.devices,
      abort: new AbortController().signal,
      size: manager.size,
      onResult: (id, result) => ran.set(id, result),
    }).then(() => createSummary(ran));
  };
}
