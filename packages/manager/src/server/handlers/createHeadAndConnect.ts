import { ActionMeta } from '@storyshots/core';
import { Application } from 'express-serve-static-core';
import path from 'path';
import puppeteer, { Page } from 'puppeteer';
import { WithPossibleError } from '../../reusables/types';
import { getManagerHost } from '../paths';
import { act } from '../reusables/act';
import { toPreviewFrame } from '../reusables/toPreviewFrame';
import { ManagerConfig } from '../reusables/types';
import { handlePossibleErrors } from './reusables/handlePossibleErrors';

// TODO: Implement cancellation
export async function createHeadAndConnect(
  app: Application,
  config: ManagerConfig,
) {
  const page = await openAppAndGetPage(config);

  app.post('/api/client/act', async (request, response) => {
    const actions: ActionMeta[] = request.body;

    const result: WithPossibleError<void> = await handlePossibleErrors(() =>
      toPreviewFrame(page).then((preview) => act(preview, actions)),
    );

    response.json(result);
  });
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
