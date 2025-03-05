import { pool } from '../pool';
import { createTestRuns } from './createTestRuns';
import { RunConfig } from './types';

export function run(config: RunConfig) {
  return pool(createTestRuns(config), { size: config.size });
}
