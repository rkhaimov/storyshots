import { createScreenshotsBaseline } from './createScreenshotsBaseline';
import { createRecordsBaseline } from './createRecordsBaseline';
import { ManagerConfig } from '../../../types';

export async function createBaseline(config: ManagerConfig) {
  const screenshots = await createScreenshotsBaseline(config);
  const records = await createRecordsBaseline(config);

  return { ...screenshots, ...records };
}

export type Baseline = Awaited<ReturnType<typeof createBaseline>>;
