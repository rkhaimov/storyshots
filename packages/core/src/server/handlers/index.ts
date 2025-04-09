import { Router as WSRouter } from 'express-ws';
import { ManagerConfig } from '../types';
import { createAcceptRecordsHandler } from './createAcceptRecordsHandler';
import { createAcceptScreenshotHandler } from './createAcceptScreenshotHandler';
import { createActServerSideHandler } from './createActServerSideHandler';
import { createImagePathHandler } from './createImagePathHandler';
import { createPreviewUpdateNotifier } from './createPreviewUpdateNotifier';
import { createBaseline } from './reusables/baseline';

export async function createApiHandlers(
  _router: () => WSRouter,
  config: ManagerConfig,
) {
  const router = _router();
  const baseline = await createBaseline(config);

  createAcceptScreenshotHandler(router, baseline);
  createAcceptRecordsHandler(router, baseline);
  createImagePathHandler(router, baseline);
  createPreviewUpdateNotifier(router, config.preview);

  const cleanup = await createActServerSideHandler(router, baseline, config);

  return { router, cleanup };
}
