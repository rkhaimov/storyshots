import { Application } from 'express-serve-static-core';
import { Page } from 'puppeteer';
import { ActionMeta } from '../../reusables/actions';
import { WithPossibleError } from '../../reusables/types';
import { act, toPreviewFrame } from '../act';

export function createActClientSideHandler(app: Application, page: Page) {
  app.post('/api/client/act', async (request, response) => {
    const actions: ActionMeta[] = request.body;

    const preview = await toPreviewFrame(page);
    for (const action of actions) {
      if (action.action === 'screenshot') {
        continue;
      }

      await act(preview, action);
    }

    const result: WithPossibleError<null> = {
      type: 'success',
      data: null,
    };

    response.json(result);
  });
}
