import { WaitAction } from '@storyshots/core';
import { Frame } from 'playwright';

export function doWait(preview: Frame, wait: WaitAction) {
  return preview.waitForTimeout(wait.payload.ms);
}
