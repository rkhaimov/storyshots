import { Application } from 'express-serve-static-core';
import { JournalRecord } from '../../../reusables/journal';
import { TreeOP } from '../../../reusables/tree';
import { Baseline } from '../reusables/baseline';

export function createAcceptRecordsHandler(
  app: Application,
  baseline: Baseline,
) {
  app.post('/api/record/accept/:id', async (request, response) => {
    const id = TreeOP.ensureIsLeafID(request.params.id);
    const records: JournalRecord[] = request.body;

    await baseline.acceptRecords(id, records);

    return response.end();
  });
}
