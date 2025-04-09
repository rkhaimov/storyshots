import { ActionMeta } from '@core';
import { RequestHandler } from 'express';
import { Page } from 'playwright';
import { WithPossibleError } from '../../../reusables/types';
import { act } from '../../act';
import { handlePossibleErrors } from '../../handlers/reusables/handlePossibleErrors';
import { toPreviewFrame } from '../../handlers/reusables/toPreviewFrame';
import { Server } from '../reusables/createServer';

export function createActHandler(server: Server, page: Page): RequestHandler {
  return server.router().post('/api/client/act', async (request, response) => {
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
