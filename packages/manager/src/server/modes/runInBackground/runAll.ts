import { Device, PureStoryTree, StoryID } from '@storyshots/core';
import { createSummary } from '../../../reusables/summary';
import { run } from '../../../reusables/runner/run';
import { RunConfig } from '../../../reusables/runner/run/types';
import { DeviceToTestRunState } from '../../../reusables/runner/types';
import { ManagerConfig } from '../../types';

export async function runAll(stories: PureStoryTree[], config: ManagerConfig) {
  const ran = new Map<StoryID, DeviceToTestRunState>();

  await run({
    stories,
    on: config.devices as Device[],
    abort: new AbortController().signal,
    size: config.runner.size,
    onResult: withResultsRenderer((id, result) => ran.set(id, result)),
  });

  return createSummary(ran);
}

function withResultsRenderer(
  onResult: RunConfig['onResult'],
): RunConfig['onResult'] {
  return (id, result) => {
    const { errors } = createSummary(new Map([[id, result]]));

    for (const error of errors) {
      console.log('Error has happened:');
      console.log(`Story: ${error.id}`);
      console.log(`Device: ${error.device.name}`);
      console.log(`Message: ${error.message}`);
    }

    onResult(id, result);
  };
}
