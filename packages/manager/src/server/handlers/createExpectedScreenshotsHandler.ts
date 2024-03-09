import { Application } from 'express-serve-static-core';
import {
  ActionsOnDevice,
  ExpectedScreenshots,
  Screenshot,
} from '../../reusables/types';
import { Baseline } from '../reusables/baseline';
import { isNil, TreeOP } from '@storyshots/core';

export function createExpectedScreenshotsHandler(
  app: Application,
  baseline: Baseline,
) {
  app.post('/api/screenshot/expected/:id', async (request, response) => {
    const id = TreeOP.ensureIsLeafID(request.params.id);
    const { actions, device, presets }: ActionsOnDevice = request.body;

    const others: Screenshot[] = [];
    for (const action of actions) {
      if (action.action !== 'screenshot') {
        continue;
      }

      const path = await baseline.getExpectedScreenshot(
        id,
        device,
        presets,
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
      final: await baseline.getExpectedScreenshot(
        id,
        device,
        presets,
        undefined,
      ),
      others,
    };

    response.json(result);
  });
}
