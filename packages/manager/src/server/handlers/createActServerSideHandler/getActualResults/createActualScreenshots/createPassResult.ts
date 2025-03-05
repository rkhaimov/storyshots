import { ScreenshotAction } from '@storyshots/core';
import { ScreenshotComparisonResult } from '../../../../../reusables/runner/types';
import { ExpectedPayload } from '../types';
import { createActualScreenshotPath } from './createActualScreenshotPath';

export async function createPassResult(
  payload: ExpectedPayload,
  action: ScreenshotAction,
  screenshot: Buffer,
): Promise<ScreenshotComparisonResult> {
  return {
    name: action.payload.name,
    type: 'pass',
    actual: await createActualScreenshotPath(payload, action, screenshot),
  };
}
