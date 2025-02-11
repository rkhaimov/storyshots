import { Application } from 'express-serve-static-core';
import { DeviceAndAcceptableRecords } from '../../reusables/types';
import { Baseline } from './reusables/baseline';

export function createAcceptRecordsHandler(
  app: Application,
  baseline: Baseline,
) {
  app.post('/api/record/accept', async (request, response) => {
    const { id, records, device }: DeviceAndAcceptableRecords = request.body;

    await baseline.acceptRecords(id, device, records);

    return response.end();
  });
}
