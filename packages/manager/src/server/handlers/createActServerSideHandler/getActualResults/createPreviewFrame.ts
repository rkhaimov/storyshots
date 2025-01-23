import { Page } from 'playwright';
import { createStoryURL } from '../../../paths';
import { toPreviewFrame } from '../../reusables/toPreviewFrame';
import { ExpectedPayload } from './types';

export async function createPreviewFrame(
  { story: { id, payload }, config }: ExpectedPayload,
  page: Page,
) {
  await page.goto(createStoryURL(id, payload.config, config).href, {
    waitUntil: 'networkidle',
  });

  return toPreviewFrame(page);
}
