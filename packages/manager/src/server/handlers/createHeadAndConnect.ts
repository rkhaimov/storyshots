import { Application } from 'express-serve-static-core';
import puppeteer, { Frame, Page } from 'puppeteer';
import { WithPossibleError } from '../../reusables/types';
import { act } from '../reusables/act';
import { toPreviewFrame } from '../reusables/toPreviewFrame';
import { handlePossibleErrors } from './reusables/handlePossibleErrors';
import { ActionMeta } from '@storyshots/core';
import { ManagerConfig } from '../reusables/types';
import { getManagerHost } from '../paths';
import path from 'path';

// TODO: Implement cancellation
export async function createHeadAndConnect(
  app: Application,
  config: ManagerConfig,
) {
  const page = await openAppAndGetPage(config);

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

async function openAppAndGetPage(config: ManagerConfig): Promise<Page> {
  const browser = await puppeteer.launch({
    headless: false,
    defaultViewport: null,
    args: [
      `--app=${getManagerHost(config)}`,
      '--start-maximized',
      '--test-type=gpu',
      ...createDevtoolsArgs(config),
    ],
    userDataDir: path.join(config.paths.temp, 'chrome-data'),
  });

  const [page] = await browser.pages();

  return page;
}

function createDevtoolsArgs(config: ManagerConfig): string[] {
  return config.devtools
    ? [
        `--disable-extensions-except=${config.devtools}`,
        `--load-extension=${config.devtools}`,
      ]
    : [];
}
