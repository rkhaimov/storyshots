import { Application } from 'express-serve-static-core';
import express from 'express';
import type { Baseline } from '../reusables/baseline';
import { createActServerSideHandler } from './createActServerSideHandler';
import { createAcceptScreenshotHandler } from './createAcceptScreenshotHandler';
import { createExpectedScreenshotsHandler } from './createExpectedScreenshotsHandler';
import { createScreenshotEqualHandler } from './createScreenshotEqualHandler';
import { createImagePathHandler } from './createImagePathHandler';
import { createExpectedRecordsHandler } from './createExpectedRecordsHandler';
import { createAcceptRecordsHandler } from './createAcceptRecordsHandler';
import { ManagerConfig } from '../reusables/types';

export function createApiHandlers(
  app: Application,
  baseline: Baseline,
  config: ManagerConfig,
) {
  app.use(express.json());

  createExpectedScreenshotsHandler(app, baseline);
  createExpectedRecordsHandler(app, baseline);
  createScreenshotEqualHandler(app, baseline);
  createAcceptScreenshotHandler(app, baseline);
  createAcceptRecordsHandler(app, baseline);
  createImagePathHandler(app, baseline);

  return createActServerSideHandler(app, baseline, config);
}
