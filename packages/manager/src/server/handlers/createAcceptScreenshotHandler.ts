import { Application } from 'express-serve-static-core';
import { ScreenshotToAccept } from '../../reusables/types';
import { Baseline } from './reusables/baseline';

export function createAcceptScreenshotHandler(
  app: Application,
  baseline: Baseline,
) {
  app.post('/api/screenshot/accept', async (request, response) => {
    const screenshot: ScreenshotToAccept = request.body;

    await baseline.acceptScreenshot(screenshot.actual);

    const result: void = undefined;

    return response.end(result);
  });
}
