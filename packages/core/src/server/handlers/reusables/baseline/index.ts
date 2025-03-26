import { ManagerConfig } from '../../../types';
import { createRecordsBaseline } from './createRecordsBaseline';
import { createScreenshotsBaseline } from './createScreenshotsBaseline';

export async function createBaseline(config: ManagerConfig) {
  const screenshots = await createScreenshotsBaseline(config);
  const records = await createRecordsBaseline(config);

  return { ...screenshots, ...records };
}

export type Baseline = Awaited<ReturnType<typeof createBaseline>>;
