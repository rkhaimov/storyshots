import { Application } from 'express-serve-static-core';
import { Frame, Page } from 'puppeteer';
import { ActionMeta } from '../../reusables/actions';
import { WithPossibleError } from '../../reusables/types';
import { act, toPreviewFrame } from '../act';

export function createActClientSideHandler(app: Application, page: Page) {
  app.post('/api/client/act', async (request, response) => {
    const actions: ActionMeta[] = request.body;

    const preview = await toPreviewFrame(page);
    const result = await createActResult(preview, actions);

    response.json(result);
  });
}

async function createActResult(
  preview: Frame,
  actions: ActionMeta[],
): Promise<WithPossibleError<void>> {
  for (const action of actions) {
    if (action.action === 'screenshot') {
      continue;
    }

    const result = await act(preview, action);

    if (result.type === 'error') {
      return result;
    }
  }

  return {
    type: 'success',
    data: undefined,
  };
}
