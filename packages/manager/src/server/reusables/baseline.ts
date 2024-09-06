import { createScreenshotsBaseline } from '../baseline/createScreenshotsBaseline';
import { createRecordsBaseline } from '../baseline/createRecordsBaseline';
import { ManagerConfig } from './types';

export async function createBaseline(config: ManagerConfig) {
  const screenshots = await createScreenshotsBaseline(config);
  const records = await createRecordsBaseline(config);

  return { ...screenshots, ...records };
}

export type Baseline = Awaited<ReturnType<typeof createBaseline>>;
