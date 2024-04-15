import { isNil, TreeOP } from '@storyshots/core';
import { Application } from 'express-serve-static-core';
import { ActionsAndConfig, Screenshot } from '../../reusables/types';
import { Baseline } from '../reusables/baseline';

export function createExpectedScreenshotsHandler(
  app: Application,
  baseline: Baseline,
) {
  app.post('/api/screenshot/expected/:id', async (request, response) => {
    const id = TreeOP.ensureIsLeafID(request.params.id);
    const { actions, config }: ActionsAndConfig = request.body;

    const screenshots: Screenshot[] = [];
    for (const action of actions) {
      if (action.action !== 'screenshot') {
        continue;
      }

      const path = await baseline.getExpectedScreenshot(
        id,
        config,
        action.payload.name,
      );

      if (isNil(path)) {
        continue;
      }

      screenshots.push({
        name: action.payload.name,
        path: path,
      });
    }

    response.json(screenshots);
  });
}
