import { runInBackground, RUNNER } from '../../../../packages/manager/src';
import { config } from './config';

void runInBackground({ ...config, runner: RUNNER.pool({ agentsCount: 1 }) });
