import { Application } from 'express-serve-static-core';
import { Baseline } from '../reusables/baseline';
import { JournalRecord, StoryID } from '../../reusables/types';

export function createAcceptRecordsHandler(
  app: Application,
  baseline: Baseline,
) {
  app.post('/api/record/accept/:id', async (request, response) => {
    const id = request.params.id as StoryID;
    const records: JournalRecord[] = request.body;

    baseline.acceptRecords(id, records);

    return response.end();
  });
}
