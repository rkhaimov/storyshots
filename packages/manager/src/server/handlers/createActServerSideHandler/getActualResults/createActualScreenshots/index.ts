import { Frame } from 'playwright';
import { ScreenshotsComparisonResult } from '../../../../../reusables/runner/types';
import { act } from '../../../../act';
import { ExpectedPayload } from '../types';
import { createCompareScreenshot } from './createCompareScreenshot';

export async function createActualScreenshots(
  payload: ExpectedPayload,
  preview: Frame,
) {
  const {
    story: {
      payload: { actions },
    },
  } = payload;

  const screenshots: ScreenshotsComparisonResult[] = [];
  for (const action of actions) {
    if (action.action === 'screenshot') {
      screenshots.push(await createCompareScreenshot(payload, preview, action));
    } else {
      await act(preview, action);
    }
  }

  return screenshots;
}
