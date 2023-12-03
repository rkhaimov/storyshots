import { createScreenshotsBaseline } from './baseline/createScreenshotsBaseline';
import { createRecordsBaseline } from './baseline/createRecordsBaseline';

export async function createBaseline() {
  const screenshots = await createScreenshotsBaseline();
  const records = await createRecordsBaseline();

  return { ...screenshots, ...records };
}

export type Baseline = Awaited<ReturnType<typeof createBaseline>>;
