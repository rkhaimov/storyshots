import { Application } from 'express-serve-static-core';
import { Baseline } from '../baseline';
import {
  ExpectedScreenshots,
  Screenshot,
  StoryID,
} from '../../reusables/types';
import { ActionMeta } from '../../reusables/actions';
import { isNil } from '../../reusables/utils';

export function createExpectedScreenshotsHandler(
  app: Application,
  baseline: Baseline,
) {
  app.post('/api/screenshot/expected/:id', async (request, response) => {
    const id = request.params.id as StoryID;
    const actions: ActionMeta[] = request.body;

    const others: Screenshot[] = [];
    for (const action of actions) {
      if (action.action !== 'screenshot') {
        continue;
      }

      const path = await baseline.getExpectedScreenshot(
        id,
        action.payload.name,
      );

      if (isNil(path)) {
        continue;
      }

      others.push({
        name: action.payload.name,
        path: path,
      });
    }

    const result: ExpectedScreenshots = {
      final: await baseline.getExpectedScreenshot(id, undefined),
      others,
    };

    response.json(result);
  });
}
