import { Application } from 'express-serve-static-core';
import { Frame, Page } from 'puppeteer';
import { ActionMeta } from '../../reusables/actions';
import { act } from '../reusables/act';
import { toPreviewFrame } from '../reusables/toPreviewFrame';
import { handlePossibleErrors } from './reusables/with-possible-error';

export function createActClientSideHandler(app: Application, page: Page) {
  app.post('/api/client/act', async (request, response) => {
    const actions: ActionMeta[] = request.body;

    const preview = await toPreviewFrame(page);

    const result = await handlePossibleErrors(() =>
      createActResult(preview, actions),
    );

    response.json(result);
  });
}

async function createActResult(
  preview: Frame,
  actions: ActionMeta[],
): Promise<void> {
  for (const action of actions) {
    if (action.action === 'screenshot') {
      continue;
    }

    await act(preview, action);
  }
}
