import express from 'express';
import { Application } from 'express-serve-static-core';
import type { Baseline } from '../reusables/baseline';
import { ManagerConfig } from '../reusables/types';
import { createAcceptRecordsHandler } from './createAcceptRecordsHandler';
import { createAcceptScreenshotHandler } from './createAcceptScreenshotHandler';
import { createActServerSideHandler } from './createActServerSideHandler';
import { createImagePathHandler } from './createImagePathHandler';

export function createApiHandlers(
  app: Application,
  baseline: Baseline,
  config: ManagerConfig,
) {
  app.use(express.json());

  createAcceptScreenshotHandler(app, baseline);
  createAcceptRecordsHandler(app, baseline);
  createImagePathHandler(app, baseline);

  return createActServerSideHandler(app, baseline, config);
}
