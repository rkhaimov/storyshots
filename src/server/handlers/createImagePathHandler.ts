import { Application } from 'express-serve-static-core';
import { Baseline } from '../baseline';
import { assert } from '../../reusables/utils';
import { ScreenshotPath } from '../../reusables/types';

export function createImagePathHandler(app: Application, baseline: Baseline) {
  app.get('/api/image/path', async (request, response) => {
    const file = request.query.file;

    assert(typeof file === 'string');

    response.contentType('image/png');
    response.send(await baseline.readScreenshot(file as ScreenshotPath));
  });
}
