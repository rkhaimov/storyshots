import { ScreenshotAction } from '@storyshots/core';
import { ExpectedPayload } from '../types';

export async function createActualScreenshotPath(
  { baseline, story }: ExpectedPayload,
  action: ScreenshotAction,
  actual: Buffer,
) {
  return baseline.createActualScreenshot(
    story.id,
    story.payload.config,
    action.payload.name,
    actual,
  );
}
