import { Application } from 'express-serve-static-core';
import { ScreenshotsToCompare } from '../../reusables/types';
import { Baseline } from '../reusables/baseline';
import { areScreenshotsEqual } from './reusables/areScreenshotsEqual';

export function createScreenshotEqualHandler(
  app: Application,
  baseline: Baseline,
) {
  app.post('/api/screenshot/equals', async (request, response) => {
    const body: ScreenshotsToCompare = request.body;

    return response.json(
      areScreenshotsEqual(
        await baseline.readScreenshot(body.left),
        await baseline.readScreenshot(body.right),
      ),
    );
  });
}
