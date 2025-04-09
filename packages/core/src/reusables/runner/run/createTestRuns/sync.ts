import { Device, StoryID } from '@core';
import { DeviceToTestRunState, TestRunState } from '../../types';
import { RunConfig } from '../types';
import { CancellableEventsFactory } from './cancellable';
import { Test } from './createTests';

export const sync =
  (config: RunConfig): CancellableEventsFactory =>
  (tests) => {
    const state = createSyncState(config);

    schedule(tests, state);

    return {
      onStart: (test) =>
        state.set(test.story.id, test.device, { type: 'running' }),
      onFinish: (test, details) =>
        state.set(test.story.id, test.device, { type: 'done', details }),
      onCancel: (test) => state.delete(test.story.id, test.device),
    };
  };

function schedule(tests: Test[], state: ReturnType<typeof createSyncState>) {
  for (const test of tests) {
    state.set(test.story.id, test.device, { type: 'scheduled' });
  }
}

function createSyncState(config: RunConfig) {
  const storage = new Map<StoryID, DeviceToTestRunState>();

  const get = (id: StoryID) =>
    storage.get(id) ?? (new Map() as DeviceToTestRunState);

  const set = (id: StoryID, state: DeviceToTestRunState) => {
    storage.set(id, state);

    config.onResult(id, state);
  };

  return {
    set: (id: StoryID, device: Device, state: TestRunState) =>
      set(id, get(id).set(device, state)),
    delete: (id: StoryID, device: Device) => {
      const state = get(id);

      state.delete(device);

      set(id, state);
    },
  };
}
