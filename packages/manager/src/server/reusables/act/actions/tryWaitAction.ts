import { wait, WaitAction } from '@storyshots/core';

export function tryWaitAction(action: WaitAction) {
  return wait(action.payload.ms);
}
