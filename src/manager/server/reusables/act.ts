import { Frame } from 'puppeteer';
import { ActionMeta, ScreenshotAction } from '../../../reusables/actions';
import { wait } from '../../../reusables/utils';
import { select } from './select';

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
