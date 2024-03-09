import { Application, Response } from 'express-serve-static-core';
import { ScreenshotPath } from '../../reusables/types';
import { Baseline } from '../reusables/baseline';
import { assert } from '@storyshots/core';

export function createImagePathHandler(app: Application, baseline: Baseline) {
  app.get('/api/image/path', async (request, response) => {
    const file = request.query.file;

    assert(typeof file === 'string');

    setNoCache(response);

    response.send(await baseline.readScreenshot(file as ScreenshotPath));
  });
}

function setNoCache(response: Response) {
  response.contentType('image/png');
  response.setHeader('Surrogate-Control', 'no-store');

  response.setHeader(
    'Cache-Control',
    'no-store, no-cache, must-revalidate, proxy-revalidate',
  );

  response.setHeader('Expires', '0');
}
