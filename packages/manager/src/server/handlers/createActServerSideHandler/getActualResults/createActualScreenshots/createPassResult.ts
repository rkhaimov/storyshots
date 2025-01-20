import { ScreenshotAction } from '@storyshots/core';
import { ScreenshotsComparisonResult } from '../../../../../reusables/runner/types';
import { ExpectedPayload } from '../types';
import { createActualScreenshotPath } from './createActualScreenshotPath';

export async function createPassResult(
  payload: ExpectedPayload,
  action: ScreenshotAction,
  screenshot: Buffer,
): Promise<ScreenshotsComparisonResult> {
  return {
    name: action.payload.name,
    result: {
      type: 'pass',
      actual: await createActualScreenshotPath(payload, action, screenshot),
    },
  };
}
