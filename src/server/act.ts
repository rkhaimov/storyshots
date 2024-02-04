import { Frame, Page } from 'puppeteer';
import { NonScreenshotAction, SelectorMeta } from '../reusables/actions';
import { WithPossibleError } from '../reusables/types';
import { assertNotEmpty } from '../reusables/utils';
import { WithPossibleErrorOP } from './handlers/reusables/with-possible-error';

export async function toPreviewFrame(page: Page): Promise<Frame> {
  const preview = await page.$('#preview');

  assertNotEmpty(preview, 'Was not able to locate preview element');

  const frame = await preview.contentFrame();

  assertNotEmpty(frame, 'Was not able to get access to content frame');

  return frame;
}

export async function act(
  preview: Frame,
  action: NonScreenshotAction,
): Promise<WithPossibleError<void>> {
  return WithPossibleErrorOP.fromThrowable(() => _act(action, preview));
}

function _act(action: NonScreenshotAction, preview: Frame) {
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
