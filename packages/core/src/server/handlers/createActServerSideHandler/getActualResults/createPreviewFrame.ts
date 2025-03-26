import { Page } from 'playwright';
import { createStoryURL } from '../../../paths';
import { toPreviewFrame } from '../../reusables/toPreviewFrame';
import { ExpectedPayload } from './types';

export async function createPreviewFrame(
  { story, config }: ExpectedPayload,
  page: Page,
) {
  await page.goto(createStoryURL(story, config).href, {
    waitUntil: 'networkidle',
  });

  return toPreviewFrame(page);
}
