import { ScreenshotAction } from '@core';
import { isNil } from '@lib';
import { Frame } from 'playwright';
import { ScreenshotComparisonResult } from '../../../../../reusables/runner/types';
import { ExpectedPayload } from '../types';
import { capture } from './capture';
import { createFailResult } from './createFailResult';
import { createFreshResult } from './createFreshResult';
import { createPassResult } from './createPassResult';
import { equals } from './equals';
import { findExpected } from './findExpected';

export async function createCompareScreenshot(
  payload: ExpectedPayload,
  preview: Frame,
  action: ScreenshotAction,
): Promise<ScreenshotComparisonResult> {
  const actual = await capture(payload, preview, action);
  const expected = findExpected(payload, action);

  if (isNil(expected)) {
    return createFreshResult(payload, action, actual);
  }

  if (await equals(payload, actual, expected)) {
    return createPassResult(payload, action, actual);
  }

  return createFailResult(payload, action, actual, expected);
}
