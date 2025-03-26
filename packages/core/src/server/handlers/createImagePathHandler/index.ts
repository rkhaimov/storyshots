import { assert } from '@lib';
import { Router } from 'express';
import { ScreenshotPath } from '../../../reusables/types';
import { Baseline } from '../reusables/baseline';
import { setNoCache } from './setNoCache';

export function createImagePathHandler(router: Router, baseline: Baseline) {
  router.get('/api/image/path', async (request, response) => {
    const file = request.query.file;

    assert(typeof file === 'string');

    response.contentType('image/png');
    setNoCache(response);

    response.send(await baseline.readScreenshot(file as ScreenshotPath));
  });
}
