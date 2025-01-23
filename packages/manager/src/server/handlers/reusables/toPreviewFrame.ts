import { Frame, Page } from 'playwright';
import { assertNotEmpty } from '@storyshots/core';

export async function toPreviewFrame(page: Page): Promise<Frame> {
  const preview = await page.$('#preview');

  assertNotEmpty(preview, 'Was not able to locate preview element');

  const frame = await preview.contentFrame();

  assertNotEmpty(frame, 'Was not able to get access to content frame');

  return frame;
}
