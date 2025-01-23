import { TreeOP } from '@storyshots/core';
import { Application } from 'express-serve-static-core';
import { DeviceAndRecord } from '../../reusables/types';
import { Baseline } from './reusables/baseline';

export function createAcceptRecordsHandler(
  app: Application,
  baseline: Baseline,
) {
  app.post('/api/record/accept/:id', async (request, response) => {
    const id = TreeOP.ensureIsLeafID(request.params.id);
    const payload: DeviceAndRecord = request.body;

    await baseline.acceptRecords(id, payload);

    return response.end();
  });
}
