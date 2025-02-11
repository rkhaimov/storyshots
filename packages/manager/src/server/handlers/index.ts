import express from 'express';
import { Application } from 'express-serve-static-core';
import { ManagerConfig } from '../types';
import { createAcceptRecordsHandler } from './createAcceptRecordsHandler';
import { createAcceptScreenshotHandler } from './createAcceptScreenshotHandler';
import { createActServerSideHandler } from './createActServerSideHandler';
import { createImagePathHandler } from './createImagePathHandler';
import { createBaseline } from './reusables/baseline';
import { regexpJSONReviver } from '../../reusables/regexpJSON';

export async function createApiHandlers(
  app: Application,
  config: ManagerConfig,
) {
  const baseline = await createBaseline(config);

  app.use(express.json({ reviver: regexpJSONReviver }));

  createAcceptScreenshotHandler(app, baseline);
  createAcceptRecordsHandler(app, baseline);
  createImagePathHandler(app, baseline);

  return createActServerSideHandler(app, baseline, config);
}
