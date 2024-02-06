import { Application } from 'express-serve-static-core';
import { Baseline } from '../reusables/baseline';
import { ScreenshotsToCompare } from '../../reusables/types';
import { PNG } from 'pngjs';
import pixelmatch from 'pixelmatch';

export function createScreenshotEqualHandler(
  app: Application,
  baseline: Baseline,
) {
  app.post('/api/screenshot/equals', async (request, response) => {
    const body: ScreenshotsToCompare = request.body;

    const left = PNG.sync.read(await baseline.readScreenshot(body.left));
    const right = PNG.sync.read(await baseline.readScreenshot(body.right));

    if (left.width !== right.width) {
      return response.json(false);
    }

    if (left.height !== right.height) {
      return response.json(false);
    }

    const diff = pixelmatch(
      left.data,
      right.data,
      null,
      left.width,
      left.height,
    );

    return response.json(diff === 0);
  });
}
