import { Application } from 'express-serve-static-core';
import { Baseline } from './reusables/baseline';
import { AcceptableScreenshot } from '../../reusables/runner/types';

export function createAcceptScreenshotHandler(
  app: Application,
  baseline: Baseline,
) {
  app.post('/api/screenshot/accept', async (request, response) => {
    const screenshot: AcceptableScreenshot = request.body;

    await baseline.acceptScreenshot(screenshot.actual);

    const result: void = undefined;

    return response.end(result);
  });
}
