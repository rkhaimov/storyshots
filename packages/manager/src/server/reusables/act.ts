import { Frame } from 'puppeteer';
import { select } from './select';
import { ActionMeta, ScreenshotAction, wait } from '@storyshots/core';

export async function act(
  preview: Frame,
  action: Exclude<ActionMeta, ScreenshotAction>,
): Promise<void> {
  if (action.action === 'wait') {
    return wait(action.payload.ms);
  }

  const element = await select(preview, action.payload.on);

  switch (action.action) {
    case 'click':
      return element.click();
    case 'hover':
      return element.hover();
    case 'fill':
      return element.type(action.payload.text);
  }
}
