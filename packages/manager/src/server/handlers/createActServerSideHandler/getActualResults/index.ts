import { Page } from 'playwright';
import { createActualRecords } from './createActualRecords';
import { createActualScreenshots } from './createActualScreenshots';
import { createPreviewFrame } from './createPreviewFrame';
import { ExpectedPayload } from './types';

export async function getActualResults(payload: ExpectedPayload, page: Page) {
  const preview = await createPreviewFrame(payload, page);
  const screenshots = await createActualScreenshots(payload, preview);
  const records = await createActualRecords(preview);

  return {
    screenshots,
    records,
  };
}

export type ActualResults = Awaited<ReturnType<typeof getActualResults>>;
