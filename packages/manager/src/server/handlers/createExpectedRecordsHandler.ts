import { Device, TreeOP } from '@storyshots/core';
import { Application } from 'express-serve-static-core';
import { Baseline } from '../reusables/baseline';
import { setNoCache } from './reusables/setNoCache';

export function createExpectedRecordsHandler(
  app: Application,
  baseline: Baseline,
) {
  app.post('/api/record/expected/:id', async (request, response) => {
    const id = TreeOP.ensureIsLeafID(request.params.id);
    const device: Device = request.body;

    const expected = await baseline.getExpectedRecords(id, device);

    setNoCache(response);

    response.json(expected === undefined ? null : expected);
  });
}
