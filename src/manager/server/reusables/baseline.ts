import { createScreenshotsBaseline } from '../baseline/createScreenshotsBaseline';
import { createRecordsBaseline } from '../baseline/createRecordsBaseline';
import { ServerConfig } from './types';

export async function createBaseline(config: ServerConfig) {
  const screenshots = await createScreenshotsBaseline(config);
  const records = await createRecordsBaseline(config);

  return { ...screenshots, ...records };
}

export type Baseline = Awaited<ReturnType<typeof createBaseline>>;
