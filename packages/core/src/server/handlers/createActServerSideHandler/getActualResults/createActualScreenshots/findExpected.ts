import { ScreenshotAction } from '@core';
import { ExpectedPayload } from '../types';

export function findExpected(
  payload: ExpectedPayload,
  action: ScreenshotAction,
) {
  return payload.expected.screenshots.find(
    (expected) => expected.name === action.payload.name,
  );
}
