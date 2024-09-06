import { Application } from 'express-serve-static-core';
import { createApiHandlers } from './handlers';
import { createBaseline } from './reusables/baseline';
import { ManagerConfig } from './reusables/types';

export async function createCommonApiHandlers(
  app: Application,
  config: ManagerConfig,
) {
  const baseline = await createBaseline(config);

  return createApiHandlers(app, baseline, config);
}
