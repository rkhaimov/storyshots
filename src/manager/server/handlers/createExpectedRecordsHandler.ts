import { Application } from 'express-serve-static-core';
import { TreeOP } from '../../../reusables/tree';
import { Baseline } from '../reusables/baseline';

export function createExpectedRecordsHandler(
  app: Application,
  baseline: Baseline,
) {
  app.get('/api/record/expected/:id', async (request, response) => {
    const id = TreeOP.ensureIsLeafID(request.params.id);

    const expected = await baseline.getExpectedRecords(id);

    response.json(expected === undefined ? null : expected);
  });
}
