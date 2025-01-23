import { ScreenshotAction } from '@storyshots/core';
import { ScreenshotsComparisonResult } from '../../../../../reusables/runner/types';
import { Screenshot } from '../../../../../reusables/types';
import { ExpectedPayload } from '../types';
import { createActualScreenshotPath } from './createActualScreenshotPath';

export async function createFailResult(
  payload: ExpectedPayload,
  action: ScreenshotAction,
  actual: Buffer,
  expected: Screenshot,
): Promise<ScreenshotsComparisonResult> {
  return {
    name: action.payload.name,
    result: {
      type: 'fail',
      actual: await createActualScreenshotPath(payload, action, actual),
      expected: expected.path,
    },
  };
}
