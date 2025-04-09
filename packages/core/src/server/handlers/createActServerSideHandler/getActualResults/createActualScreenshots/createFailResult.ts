import { ScreenshotAction } from '@core';
import { ScreenshotComparisonResult } from '../../../../../reusables/runner/types';
import { Screenshot } from '../../../../../reusables/types';
import { ExpectedPayload } from '../types';
import { createActualScreenshotPath } from './createActualScreenshotPath';

export async function createFailResult(
  payload: ExpectedPayload,
  action: ScreenshotAction,
  actual: Buffer,
  expected: Screenshot,
): Promise<ScreenshotComparisonResult> {
  return {
    name: action.payload.name,
    type: 'fail',
    actual: await createActualScreenshotPath(payload, action, actual),
    expected: expected.path,
  };
}
