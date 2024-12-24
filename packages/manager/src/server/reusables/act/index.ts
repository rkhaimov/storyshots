import { ActionMeta, ScreenshotAction } from '@storyshots/core';
import { Frame } from 'puppeteer';
import { tryToActUntilSuccessWithTimeout } from './single';

export async function act(
  preview: Frame,
  actions: ActionMeta[],
  onScreenshot: (action: ScreenshotAction) => Promise<void> = async () => {},
): Promise<void> {
  for (const action of actions) {
    if (action.action === 'screenshot') {
      await onScreenshot(action);

      continue;
    }

    await tryToActUntilSuccessWithTimeout(preview, action);
  }
}
