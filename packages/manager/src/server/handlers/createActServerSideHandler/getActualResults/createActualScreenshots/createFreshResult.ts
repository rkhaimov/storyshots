import { ScreenshotAction } from '@storyshots/core';
import { ScreenshotsComparisonResult } from '../../../../../reusables/runner/types';
import { ExpectedPayload } from '../types';
import { createActualScreenshotPath } from './createActualScreenshotPath';

export async function createFreshResult(
  payload: ExpectedPayload,
  action: ScreenshotAction,
  screenshot: Buffer,
): Promise<ScreenshotsComparisonResult> {
  return {
    name: action.payload.name,
    result: {
      type: 'fresh',
      actual: await createActualScreenshotPath(payload, action, screenshot),
    },
  };
}
