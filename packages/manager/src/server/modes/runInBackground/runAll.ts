import { Device, PureStoryTree, StoryID } from '@storyshots/core';
import { run } from '../../../reusables/runner/run';
import { DeviceToTestRunState } from '../../../reusables/runner/types';
import { createSummary } from '../../../reusables/summary';
import { ManagerConfig } from '../../types';

export async function runAll(stories: PureStoryTree[], config: ManagerConfig) {
  const ran = new Map<StoryID, DeviceToTestRunState>();

  await run({
    stories,
    on: config.devices as Device[],
    abort: new AbortController().signal,
    size: config.runner.size,
    onResult: (id, result) => ran.set(id, result),
  });

  return createSummary(ran);
}
