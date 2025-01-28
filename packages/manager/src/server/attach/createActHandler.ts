import { Application } from 'express-serve-static-core';
import { Page } from 'playwright';
import { ActionMeta } from '@storyshots/core';
import { WithPossibleError } from '../../reusables/types';
import { handlePossibleErrors } from '../handlers/reusables/handlePossibleErrors';
import { toPreviewFrame } from '../handlers/reusables/toPreviewFrame';
import { act } from '../act';

// TODO: Implement cancellation
export function createActHandler(app: Application, page: Page) {
  app.post('/api/client/act', async (request, response) => {
    const actions: ActionMeta[] = request.body;

    const result: WithPossibleError<void> = await handlePossibleErrors(
      async () => {
        const preview = await toPreviewFrame(page);

        for (const action of actions) {
          if (action.action === 'screenshot') {
            continue;
          }

          await act(preview, action);
        }
      },
    );

    response.json(result);
  });
}
