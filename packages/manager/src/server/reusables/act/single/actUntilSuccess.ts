import { ActionMeta, ScreenshotAction, wait } from '@storyshots/core';
import { Frame } from 'puppeteer';
import { tryToActSingle } from './tryToActSingle';

export async function* actUntilSuccess(
  preview: Frame,
  action: Exclude<ActionMeta, ScreenshotAction>,
): AsyncGenerator<string, void> {
  while (true) {
    try {
      await tryToActSingle(preview, action);

      return;
    } catch (error) {
      if (error instanceof Error) {
        yield error.message;
      } else {
        console.log(error);

        yield 'Unknown error has been received. See console for more details.';
      }

      await wait(100);
    }
  }
}
