import { Application } from 'express-serve-static-core';
import { Frame, Page } from 'puppeteer';
import { ActionMeta } from '../../../reusables/actions';
import { WithPossibleError } from '../../reusables/types';
import { act } from '../reusables/act';
import { toPreviewFrame } from '../reusables/toPreviewFrame';
import { handlePossibleErrors } from './reusables/handlePossibleErrors';

// TODO: Implement cancellation
export function createActClientSideHandler(app: Application, page: Page) {
  app.post('/api/client/act', async (request, response) => {
    const actions: ActionMeta[] = request.body;

    const result: WithPossibleError<void> = await handlePossibleErrors(() =>
      toPreviewFrame(page).then((preview) => createActResult(preview, actions)),
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
