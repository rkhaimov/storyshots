import { Application } from 'express-serve-static-core';
import express from 'express';
import { Page } from 'puppeteer';
import type { Baseline } from '../baseline';
import { createActClientSideHandler } from './createActClientSideHandler';
import { createActServerSideHandler } from './createActServerSideHandler';
import { createAcceptScreenshotHandler } from './createAcceptScreenshotHandler';
import { createExpectedScreenshotsHandler } from './createExpectedScreenshotsHandler';
import { createScreenshotEqualHandler } from './createScreenshotEqualHandler';
import { createImagePathHandler } from './createImagePathHandler';
import { createExpectedRecordsHandler } from './createExpectedRecordsHandler';
import { createAcceptRecordsHandler } from './createAcceptRecordsHandler';

export function createApiHandlers(
  app: Application,
  page: Page,
  baseline: Baseline,
) {
  app.use(express.json());

  createActClientSideHandler(app, page);
  createActServerSideHandler(app, baseline);
  createExpectedScreenshotsHandler(app, baseline);
  createExpectedRecordsHandler(app, baseline);
  createScreenshotEqualHandler(app, baseline);
  createAcceptScreenshotHandler(app, baseline);
  createAcceptRecordsHandler(app, baseline);
  createImagePathHandler(app, baseline);
}
