import { Frame, Page } from 'puppeteer';
import {
  ActionMeta,
  ScreenshotAction,
  SelectorMeta,
} from '../reusables/actions';
import { assertNotEmpty } from '../reusables/utils';

export async function toPreviewFrame(page: Page): Promise<Frame> {
  const preview = await page.$('#preview');

  assertNotEmpty(preview, 'Was not able to locate preview element');

  const frame = await preview.contentFrame();

  assertNotEmpty(frame, 'Was not able to get access to content frame');

  return frame;
}

export async function act(
  preview: Frame,
  action: Exclude<ActionMeta, ScreenshotAction>,
): Promise<void> {
  console.log('DOING', action.action, action.payload.on);

  switch (action.action) {
    case 'click': {
      const on = toSelector(action.payload.on);

      return preview.locator(on).click();
    }
  }
}

function toSelector(input: SelectorMeta): string {
  switch (input.selector) {
    case 'aria': {
      const entries = Object.entries({
        role: input.payload.role,
        ...input.payload.attrs,
      });

      return `::-p-aria(${entries
        .map(([name, value]) => `[${name}="${value}"]`)
        .join('')})`;
    }
  }
}
