import { ScreenshotAction } from '@storyshots/core';
import { ExpectedPayload } from '../types';

export async function createActualScreenshotPath(
  { baseline, story }: ExpectedPayload,
  action: ScreenshotAction,
  actual: Buffer,
) {
  return baseline.createActualScreenshot(story, action.payload.name, actual);
}
