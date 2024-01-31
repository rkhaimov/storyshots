import { Application } from 'express-serve-static-core';
import { Baseline } from '../baseline';
import { StoryID } from '../../reusables/types';

export function createExpectedRecordsHandler(
  app: Application,
  baseline: Baseline,
) {
  app.get('/api/record/expected/:id', async (request, response) => {
    const id = request.params.id as StoryID;

    const expected = await baseline.getExpectedRecords(id);

    response.json(expected === undefined ? null : expected);
  });
}
