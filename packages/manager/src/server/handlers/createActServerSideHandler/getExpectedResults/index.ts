import { BasePayload } from '../types';
import { findExpectedScreenshots } from './findExpectedScreenshots';

export async function getExpectedResults(payload: BasePayload) {
  const {
    story: {
      id,
      payload: { device },
    },
    baseline,
  } = payload;

  return {
    records: await baseline.getExpectedRecords(id, device),
    screenshots: await findExpectedScreenshots(payload),
  };
}

export type ExpectedResults = Awaited<ReturnType<typeof getExpectedResults>>;
