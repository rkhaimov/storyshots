import { Page } from 'playwright';
import { createActualScreenshots } from './createActualScreenshots';
import { createPreviewFrame } from './createPreviewFrame';
import { getActualRecords } from './getActualRecords';
import { ExpectedPayload } from './types';

export async function getActualResults(payload: ExpectedPayload, page: Page) {
  const preview = await createPreviewFrame(payload, page);
  const screenshots = await createActualScreenshots(payload, preview);
  const records = await getActualRecords(preview);

  return {
    screenshots,
    records,
  };
}

export type ActualResults = Awaited<ReturnType<typeof getActualResults>>;
