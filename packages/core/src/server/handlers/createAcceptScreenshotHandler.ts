import { Router } from 'express';
import { AcceptableScreenshot } from '../../reusables/runner/types';
import { Baseline } from './reusables/baseline';

export function createAcceptScreenshotHandler(
  router: Router,
  baseline: Baseline,
) {
  router.post('/api/screenshot/accept', async (request, response) => {
    const screenshot: AcceptableScreenshot = request.body;

    await baseline.acceptScreenshot(screenshot.actual);

    const result: void = undefined;

    return response.end(result);
  });
}
